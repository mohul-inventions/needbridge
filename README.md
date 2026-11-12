# NEEDBRIDGE 🌐
### AI-Powered Cross-Community Demand Intelligence & Collective Procurement Network

> *"Your needs are individual. Your purchasing power is collective."*

NEEDBRIDGE is an enterprise-grade fintech and multi-agent procurement network. It intelligently discovers compatible purchasing requirements across independent educational institutions, small businesses, non-profits, and individual buyers—aggregating fragmented demand into high-volume collective purchasing campaigns with verified institutional discounts.

---

## 🏗️ Technology Architecture

### Frontend
- **Framework**: React 19 (React 18+ compatible) with TypeScript & Vite
- **Styling**: Tailwind CSS v4 with custom fintech palette (Deep Navy `#080B16`, Charcoal `#101729`, Surface `#151F33`, Cyan `#38BDF8`, Violet `#8B5CF6`)
- **Visualizations**: Recharts (Volume by Sector, Capital Allocation, Radar Factor Analysis)
- **Icons**: Lucide React
- **Animations & Transitions**: CSS transitions & glassmorphism

### Backend
- **Framework**: Python FastAPI
- **Database**: Relational SQLite zero-dependency local store with full PostgreSQL / pgvector migration compatibility (`DATABASE_URL`)
- **Schema & Relational Integrity**: 19 relational tables with foreign keys, JSON specifications, and cascade constraints
- **Authentication**: JWT (JSON Web Tokens) with PBKDF2-HMAC-SHA256 salted password hashing & Role-Based Access Control (RBAC)
- **API Documentation**: Automatic interactive OpenAPI documentation at `/docs`

### Multi-Agent AI System (7 Specialized Agents)
1. **Demand Intelligence Agent**: Parses unstructured requirement text, extracts implicit specifications (RAM, CPU, storage, warranty), and generates normalized semantic tokens.
2. **Community Discovery Agent**: Identifies compatible requirements across independent communities and computes the proprietary **Demand Liquidity Score** (0–100).
3. **Procurement Optimization Agent**: Evaluates supplier quotations, bulk tiered volume discounts, MOQ thresholds, freight, and taxes to select the best Total Value option.
4. **Alternative Product Agent**: Identifies technically compatible alternative models with specification parity checks and mandatory buyer approval flags.
5. **Financial Intelligence Agent**: Computes gross individual retail baselines, collective procurement costs, escrow commitments, and pro-rata per-buyer savings.
6. **Risk & Trust Agent**: Detects predatory price dumping (>40% below median), unverified corporate registrations, and duplicate demand submissions.
7. **Procurement Coordinator Agent**: Validates buyer consensus, MOQ fulfillment, and triggers status progression from *Proposal Ready* to *Threshold Achieved* and *Purchased*.

### Financial & PayPal Sandbox Integration
- **Escrow Authorization Workflow**: Creates orders via backend `/api/payments/create-order` and captures authorized funds via `/api/payments/capture-order`.
- **Transparent Procurement Ledger**: Auditable cryptographic event stream tracking Buyer Deposits, Escrow Holds, Supplier Payouts, and Refunds.
- **Formulas**:
  - `Total Individual Cost = Estimated Individual Cost × Quantity`
  - `Collective Cost = Actual Campaign Procurement Cost`
  - `Total Savings = Total Individual Cost - Collective Cost`
  - `Per-Buyer Savings = Individual Estimated Cost - Actual Allocated Cost`

---

## 👥 Role-Based Authentication & Demo Personas

The system supports 4 operational roles with pre-seeded demo accounts:

| Role | Demo Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Individual Buyer** | `maya.lin@student.org` | `BuyerPass123!` | Submit requirements, discover collective lots, track personal pro-rata savings |
| **Organization Buyer** | `marcus.chen@pacific.edu` | `BuyerPass123!` | Departmental bulk orders, member approvals, PDF compliance summaries |
| **Verified Supplier** | `supplier.apex@apexcomputing.com` | `SupplierPass123!` | Catalog SKU management, RFQ bidding, MOQ & discount tier configuration |
| **Platform Administrator**| `admin@needbridge.io` | `AdminPass123!` | Oversee 7 AI agents, toggle supplier KYC verification, audit system ledger |

*Tip: The web interface includes a persistent top banner with **One-Click Persona Switching** for instant evaluation.*

---

## 🚀 Local Execution Instructions

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 1. Start the Backend API Server

Open a terminal and navigate to `backend/`:

```bash
cd backend

# (Optional) create virtual environment
python -m venv venv
# On Windows: venv\Scripts\activate
# On Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server (starts on http://127.0.0.1:8000)
python run.py
```

*On startup, the backend automatically initializes the database schema and seeds 20 buyers, 5 organizations, 8 suppliers, 30 demands, 5 clusters, 4 campaigns, supplier quotes, deliveries, and agent execution logs.*

API Documentation is available at: **http://127.0.0.1:8000/docs**

### 2. Start the Frontend Application

Open a second terminal and navigate to `frontend/`:

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite dev server
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🧪 Automated Test Suite

Run the comprehensive unit test suite covering authentication, semantic matching, specification compatibility, liquidity scoring, and multi-agent coordination:

```bash
cd backend
python -m unittest tests/test_all.py
```

Output:
```
...........
----------------------------------------------------------------------
Ran 11 tests in 0.162s

OK
```

---

## 📊 22 Main Application Views

1. **Landing Page**: Value proposition, network liquidity counters, multi-agent overview, how it works.
2. **Authentication**: Login & registration with one-click demo persona quick-login.
3. **Role Selection**: Interactive persona switcher between the 4 platform roles.
4. **Main Dashboard**: Top metrics, demand distribution by category, funding progress, live agent decision feed.
5. **Submit Demand**: Requisition form with real-time AI pre-flight attribute extraction and compatibility check.
6. **AI Demand Analysis**: Mathematical explainability view showing match %, shared specs, differences, and alternatives.
7. **Demand Discovery Explorer**: Searchable directory of verified community requirements.
8. **Demand Clusters**: Active demand aggregations with live Demand Liquidity Scores (0–100) and conversion velocity.
9. **Procurement Campaigns**: Grid of active multi-buyer initiatives with funding bars, unit savings, and deadlines.
10. **Campaign Details**: Full campaign view, participating buyers, supplier quote comparison, approval toggle, and PayPal Sandbox escrow checkout.
11. **Supplier Marketplace**: Verified supplier directory with authenticated KYC badges and active catalog SKUs.
12. **Supplier Dashboard**: Supplier portal to register SKUs, submit RFQ bids, and specify MOQ discount curves.
13. **AI Agent Activity Center**: Auditable real-time timeline of all 7 agents with execution latency, status, decision explanations, and a "Run Live Multi-Agent Pipeline" execution button.
14. **Demand Liquidity Analytics**: Radar factor charts, factor breakdown, and methodology transparency notices.
15. **Predictive Community Demand**: Historical cyclical procurement trends (academic semesters, fiscal grant cycles) with data sufficiency warnings.
16. **Financial Dashboard**: Escrow treasury overview, collective savings calculations, and campaign capital distribution.
17. **Transaction Ledger**: Immutable financial transaction history with PayPal capture references and refund logging.
18. **Order Tracking**: Split-shipment delivery milestones, FedEx freight tracking numbers, and live transit stages.
19. **Notifications**: Alert stream covering demand matches, quote selections, and escrow authorizations.
20. **User Profile**: Verified institutional credentials, delivery nodes, and buyer trust ratings.
21. **Organization Management**: Multi-user team governance, member invitation, and compliance PDF generation.
22. **Administrator Console**: Platform health, user roster, supplier KYC toggle, and audit logging.
23. **Settings**: Configurable AI model API keys (Gemini / OpenAI), PayPal mode, and database connection strings.

---

## ☁️ Deployment Instructions

### Frontend (Vercel)
1. Link your GitHub repository to Vercel.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure `VITE_API_URL` environment variable pointing to your deployed backend.

### Backend (Render / Railway)
1. Create a new Web Service pointing to `backend/`.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `DATABASE_URL`: Hosted PostgreSQL connection URI (e.g., `postgresql://...`)
   - `SECRET_KEY`: A secure 32+ character random string
   - `PAYPAL_MODE`: `sandbox`
   - `PAYPAL_CLIENT_ID`: Your PayPal Sandbox Client ID
   - `PAYPAL_CLIENT_SECRET`: Your PayPal Sandbox Secret

---

## 🛡️ Security & Privacy Architecture

- **Card Privacy**: Card numbers are never accepted or stored; payments use PayPal Sandbox OAuth & Escrow redirect flows.
- **Cryptographic Hashing**: Salted PBKDF2-HMAC-SHA256 with 100,000 iterations for password protection.
- **Authorization**: Role-based access control protecting supplier and administrator routes.
- **Anti-Dumping & Fraud Detection**: Risk & Trust Agent scans for unverified vendors, extreme price deviation, and duplicate bot submissions.
- **SQL Injection Prevention**: Parameterized database queries across all repository routes.

---

## ⚠️ Known Limitations & Future Roadmap

- **External AI Inference**: By default, the system runs with deterministic vector and semantic attribute extraction. Supplying a `GEMINI_API_KEY` in Settings upgrades the pipeline to full LLM multimodal parsing.
- **PayPal Real Payments**: Configured strictly in Sandbox mode to prevent accidental live monetary charges during hackathon demonstrations.
- **Logistics Integration**: Carrier tracking codes and transit stages use FedEx Freight simulation models for demonstration purposes.

---

## 📄 License

Licensed under the [MIT License](LICENSE) (OSI-approved).
