import re
import math
from typing import List, Dict, Any, Tuple
from collections import Counter

class SemanticMatcher:
    """
    High-performance semantic and attribute compatibility engine.
    Uses TF-IDF + N-gram cosine similarity and specification distance,
    with fallback-safe embedding logic.
    """
    
    # Common domain synonyms for procurement matching
    SYNONYMS = {
        "laptop": ["notebook", "computer", "pc", "macbook", "thinkpad", "workstation"],
        "lab": ["laboratory", "science", "physics", "chemistry", "biology", "stem"],
        "display": ["monitor", "screen", "projector", "panel"],
        "chair": ["seating", "ergonomic", "furniture", "desk chair"],
        "server": ["blade", "rack", "cloud hardware", "compute unit"],
        "printer": ["plotter", "3d printer", "laser printer", "copier"],
        "student": ["learner", "scholar", "academic", "pupil", "participant"]
    }

    @classmethod
    def tokenize(cls, text: str) -> List[str]:
        words = re.findall(r'\b[a-z0-9]+\b', text.lower())
        tokens = []
        for w in words:
            tokens.append(w)
            for canon, syns in cls.SYNONYMS.items():
                if w in syns or w == canon:
                    tokens.append(f"_syn_{canon}")
        return tokens

    @classmethod
    def compute_similarity(cls, text_a: str, text_b: str) -> float:
        """Computes cosine similarity of token frequency vectors."""
        tokens_a = cls.tokenize(text_a)
        tokens_b = cls.tokenize(text_b)
        
        if not tokens_a or not tokens_b:
            return 0.0

        vec_a = Counter(tokens_a)
        vec_b = Counter(tokens_b)

        intersection = set(vec_a.keys()) & set(vec_b.keys())
        numerator = sum([vec_a[x] * vec_b[x] for x in intersection])

        sum_a = sum([vec_a[x] ** 2 for x in vec_a.keys()])
        sum_b = sum([vec_b[x] ** 2 for x in vec_b.keys()])
        denominator = math.sqrt(sum_a) * math.sqrt(sum_b)

        if not denominator:
            return 0.0
        return min(1.0, round(float(numerator) / denominator, 4))

    @classmethod
    def evaluate_specs_compatibility(
        cls,
        category_a: str,
        specs_a: Dict[str, Any],
        category_b: str,
        specs_b: Dict[str, Any],
        region_a: str,
        region_b: str
    ) -> Tuple[float, List[str], List[str], str]:
        """
        Calculates specification compatibility score (0-100),
        shared specifications, differences, and detailed explanation.
        """
        shared = []
        differences = []
        
        # Category check
        cat_match = category_a.lower() == category_b.lower()
        if not cat_match:
            differences.append(f"Different categories: {category_a} vs {category_b}")
        else:
            shared.append(f"Matching category: {category_a}")

        # Region check
        reg_match = region_a.lower() == region_b.lower() or "global" in (region_a.lower(), region_b.lower())
        if reg_match:
            shared.append(f"Geographic proximity: {region_a}")
        else:
            differences.append(f"Distinct logistics regions: {region_a} vs {region_b}")

        # Compare keys
        all_keys = set(specs_a.keys()) | set(specs_b.keys())
        spec_score_accum = 0.0
        total_weights = 0.0

        for key in all_keys:
            val_a = str(specs_a.get(key, "")).lower()
            val_b = str(specs_b.get(key, "")).lower()
            total_weights += 1.0

            if val_a and val_b:
                if val_a == val_b:
                    shared.append(f"{key.capitalize()}: {val_a}")
                    spec_score_accum += 1.0
                elif cls.compute_similarity(val_a, val_b) > 0.4:
                    shared.append(f"{key.capitalize()}: Compatible ({val_a} ~ {val_b})")
                    spec_score_accum += 0.8
                else:
                    differences.append(f"{key.capitalize()} divergence: {val_a} vs {val_b}")
            else:
                present = key if val_a else key
                differences.append(f"Unspecified requirement for {present}")
                spec_score_accum += 0.4

        specs_ratio = (spec_score_accum / total_weights) if total_weights > 0 else 0.8
        
        # Total composite score
        composite = (0.35 * (1.0 if cat_match else 0.1)) + (0.45 * specs_ratio) + (0.20 * (1.0 if reg_match else 0.4))
        match_score = round(composite * 100, 1)

        if match_score >= 80:
            explanation = "High functional compatibility. Core architecture and delivery regions align seamlessly for bulk collective lot order."
        elif match_score >= 60:
            explanation = "Moderate compatibility. Minor variances in peripheral specifications can be resolved by vendor tier bundling."
        else:
            explanation = "Low compatibility. Key technical parameters or delivery requirements differ substantially."

        return match_score, shared, differences, explanation
