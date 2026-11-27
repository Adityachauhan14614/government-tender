# TenderSetu - Government Tender Matchmaking Platform for MSMEs

> An intelligent MSME tender discovery & eligibility matchmaking platform where businesses maintain rich profiles (industry, operational states, certifications, turnover range, capabilities, and statutory recognitions) and automatically match permitted government tender criteria against their pre-qualification capability.

Built in alignment with the **Public Procurement Policy for Micro and Small Enterprises (MSEs) Order 2012** and **Rule 173(i) of the General Financial Rules (GFR) 2017**.

---

## 🎯 Key Features

### 1. Intelligent MSME Eligibility Matchmaking Engine
- **Multi-Factor Weighted Diagnostic (0 to 100%)**:
  - **Turnover Verification**: Compares 3-year average turnover against mandatory thresholds; automatically applies **GFR 2017 Rule 173(i)** turnover relaxation for Micro and Small enterprises where permitted.
  - **Certifications Cross-Check**: Validates mandatory accreditations (ISO 9001, ISO 14001, ISO 27001, ISO 13485, BIS/ISI, ZED Gold/Silver, CDSCO MD-5, CIPET, CERT-In, CMMI) and highlights missing ones.
  - **Past Work Order Scale**: Verifies past single largest contract value against tender qualification criteria.
  - **Operational Longevity**: Compares active operational years against RFP requirements with DPIIT Startup India exemptions.
  - **Location Advantage**: Identifies Pan-India, home-state, or regional operational feasibility.
  - **Sector Alignment**: Analyzes industry sectors and NIC code overlap.
- **Categorized Match Verdicts**:
  - `HIGH_MATCH` (Score ≥ 80%): Ready to bid immediately.
  - `MODERATE_MATCH` (Score 60–79%): Conditionally eligible; advises on MSE relaxation, consortium/JV, or subcontracting.
  - `LOW_MATCH` / `INELIGIBLE`: Identifies critical qualification deficits.

### 2. Statutory MSME Exemption & Quota Computation
- **100% Earnest Money Deposit (EMD) Waiver**: Automatically calculates exact working capital saved (e.g. ₹9.6 Lakhs saved on ₹4.8 Cr tender) under MSMED Act 2006.
- **Tender Document Fee Exemption**: Waives document costs for MSE bidders.
- **25% Mandatory Procurement Quota & Price Preference (L1 + 15%)**: Identifies price-matching windows for MSEs with sub-allocations for Women-led (3%) and SC/ST-owned (4%) MSEs.
- **Make in India (Class-I / Class-II)** Local Content Preference integration.

### 3. Comprehensive Tender Feeds & Search
- Realistic tender data across **GeM (Government e-Marketplace)**, **CPPP (Central Public Procurement Portal)**, and **IREPS (Indian Railways)**.
- Filter by Match Verdict (High/Moderate), Portal, Sector (Solar, IT/Cybersecurity, Medical Supplies, Civil Works, Eco-Packaging), EMD Waiver, and Submission Deadline.
- Switch between **Visual Grid Cards** and **Executive Table View**.

### 4. Interactive Bid Preparation Checklist & Margin Simulator
- Pre-populated document checklist per tender:
  - Udyam Registration Certificate
  - Audited Financial Statements with CA UDIN
  - Test reports from NABL/CIPET accredited laboratories
  - EMD Exemption Undertaking
  - Make in India Class-I Local Content Declaration
- Live checklist progress tracking (persisted to LocalStorage).
- **Price & Margin Simulator**: Calculates competitive discount margins against official estimated values under the L1 + 15% rule.

### 5. Multi-Profile Switcher & Profile Editor
- Switch between 5 diverse pre-configured MSME enterprises:
  1. *IndoSun Renewable & Power Systems Pvt Ltd* (Small, Solar & Electrical, ₹8.4 Cr Turnover, Gujarat)
  2. *Nexus CyberSecurity & Cloud IT Solutions* (Small, IT & VAPT, ₹3.1 Cr Turnover, Bengaluru)
  3. *Aarogya MedTech & Surgical Supplies* (Micro, Medical Devices, ₹1.1 Cr Turnover, Chennai, Women-Led)
  4. *Vanguard Civil Infrastructure & Roads* (Medium, Civil Works, ₹34.5 Cr Turnover, UP/Delhi NCR)
  5. *EcoKriti Biopolymers & Sustainable Krafts* (Micro, Eco Packaging, ₹65 Lakh Turnover, Jaipur, SC/ST Owned)
- Create or customize any enterprise profile with live recalculation of all tender matches.

### 6. Side-by-Side Tender Comparison Tool
- Compare up to 3 tenders simultaneously across scores, values, EMD requirements, deadlines, and technical criteria hurdles.

### 7. Bid Pipeline & Document Tracker (Kanban)
- Visual stage-by-stage pipeline: *Bookmarked → Reviewing RFP → Preparing Documents → Bid Submitted → Awarded*.
- Tracks cumulative addressable contract value.

### 8. Official Policy & Exemption Guide
- Interactive knowledge base covering:
  - Public Procurement Policy for MSEs Order, 2012
  - Rule 173(i) of General Financial Rules (GFR) 2017
  - Make in India Order 2017 & 2020 amendments
  - MSME Sustainable (ZED) Certification Pre-Qualification credits

### 9. Exportable / Printable Assessment Dossier
- Clean, print-ready pre-qualification report for board approvals, bank loan solvency checks, or consortium partners.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (v9 or higher)

### Installation & Run

1. Clone or navigate to the project directory:
   ```bash
   cd "e:\government tender"
   ```

2. Install dependencies (already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or the port displayed in your terminal).

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Indian Gov / MSME color palette
- **Icons**: Lucide React
- **Storage**: LocalStorage with automatic JSON state serialization
