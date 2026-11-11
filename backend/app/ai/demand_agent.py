import time
import re
from typing import Dict, Any, List
from app.ai.embeddings import SemanticMatcher

class DemandIntelligenceAgent:
    name = "Demand Intelligence Agent"

    @classmethod
    def analyze_requirement(cls, raw_title: str, raw_description: str, category: str, specs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses unstructured requirement text, extracts implicit specifications,
        and generates normalized demand metadata.
        """
        start_time = time.time()
        
        extracted_specs = dict(specs) if specs else {}
        text = f"{raw_title} {raw_description}".lower()

        # Extract RAM
        ram_match = re.search(r'(\d+)\s*(?:gb|gigabytes?)\s*(?:ram|memory)?', text)
        if ram_match and "ram" not in extracted_specs:
            extracted_specs["ram"] = f"{ram_match.group(1)}GB RAM"

        # Extract Storage
        storage_match = re.search(r'(\d+)\s*(?:gb|tb)\s*(?:ssd|hdd|nvme|storage)', text)
        if storage_match and "storage" not in extracted_specs:
            extracted_specs["storage"] = storage_match.group(0).upper()

        # Extract Processor
        cpu_match = re.search(r'(i[3579]|ryzen\s*[3579]|m[123]|apple silicon|snapdragon)', text)
        if cpu_match and "processor" not in extracted_specs:
            extracted_specs["processor"] = cpu_match.group(0).capitalize()

        # Extract Warranty
        warranty_match = re.search(r'(\d+)\s*(?:year|yr)s?\s*(?:warranty|guarantee)', text)
        if warranty_match and "warranty" not in extracted_specs:
            extracted_specs["warranty"] = f"{warranty_match.group(1)} Years"

        # Extract Quantity hints
        qty_match = re.search(r'(?:need|order|buying|for)\s*(\d{1,5})\s*(?:units|pcs|students|kits|laptops)', text)
        hinted_qty = int(qty_match.group(1)) if qty_match else None

        clarity_score = 75
        if len(extracted_specs) >= 3:
            clarity_score += 20
        if raw_description and len(raw_description) > 30:
            clarity_score += 5
        clarity_score = min(100, clarity_score)

        elapsed_ms = int((time.time() - start_time) * 1000)

        decision_explanation = (
            f"Extracted {len(extracted_specs)} technical attributes from prompt with {clarity_score}% confidence. "
            f"Requirements normalized for multi-tenant cluster aggregation."
        )

        return {
            "agent_name": cls.name,
            "status": "completed",
            "execution_time_ms": max(12, elapsed_ms),
            "decision_explanation": decision_explanation,
            "output": {
                "normalized_category": category or "Electronics",
                "extracted_specs": extracted_specs,
                "hinted_quantity": hinted_qty,
                "clarity_score": clarity_score,
                "semantic_tokens": SemanticMatcher.tokenize(f"{raw_title} {category}")
            }
        }
