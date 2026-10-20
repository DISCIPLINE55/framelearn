# Development Costs & Budget Analysis — FrameLearn

## Academic Project Financial Governance
FrameLearn is developed as a final-year BSc Information Technology Education capstone project. In alignment with academic guidelines, the project operates under strict cost transparency, relying primarily on validated free-tier developer programs during development, and projecting realistic operating expenses for production viability.

---

## 1. Confirmed Expenditures to Date
| Item | Provider / Vendor | Cost (USD) | Status | Verification Note |
|---|---|---|---|---|
| Development Tools & SDKs | Open Source (React, Vite, Vitest, Tailwind) | $0.00 | Confirmed | Licensed under MIT / Apache 2.0 open-source licenses. |
| Code Repository & Version Control | GitHub Public Repository | $0.00 | Confirmed | Hosted under `https://github.com/DISCIPLINE55/framelearn`. |
| CI Pipeline Execution | GitHub Actions (Standard public minutes) | $0.00 | Confirmed | Standard free tier for public GitHub repositories. |
| Development Hosting | Vercel Hobby Tier | $0.00 | Confirmed | Live application running at `https://framelearn.vercel.app/`. |
| **Total Confirmed Cash Spent** | — | **$0.00** | — | No financial funds disbursed to date. |

---

## 2. Verified Service Tiers & Free Allowances
*(Note: Free-tier allowances are subject to provider policy updates and are not guaranteed to be permanent.)*

| Service | Plan / Tier | Verified Allowance | Over-Quota Risk & Notes |
|---|---|---|---|
| **Vercel** | Hobby (Free) | 100 GB bandwidth / month, automated preview deployments | Commercial usage prohibited on Hobby tier; transition to Pro required if monetized. |
| **Supabase** | Free Tier | Up to 500 MB database space, 1 GB file storage, 50,000 monthly active users | Free projects are paused after 7 days of inactivity; manual unpausing or Pro upgrade needed. |
| **GitHub** | Free | 2,000 Action minutes / month (public repos unlimited for standard runners) | Sufficient for ongoing development and automated CI runs. |

---

## 3. Estimated Development Effort (Team Hours)
Estimates based on standard academic term effort allocations (3 team members):

| Milestone | Milestone Deliverable | Estimated Dev Hours | Estimated QA/Doc Hours | Total Effort | Status |
|---|---|---|---|---|---|
| **001** | Foundation & Design System | 40 hrs | 25 hrs | 65 hrs | Completed & Approved |
| **001-F** | Notification Standard & Central Docs Hub | 15 hrs | 12 hrs | 27 hrs | Completed & Approved |
| **001-P** | Interactive Portfolio & Lightbox | 20 hrs | 15 hrs | 35 hrs | Completed & Approved |
| **002** | Real Backend Foundation & Photographer Access | 35 hrs | 20 hrs | 55 hrs (Actual: 50 hrs) | Implemented Locally & Tested |
| **003** | Services & Pricing Catalog | 20 hrs | 12 hrs | 32 hrs | Scheduled |
| **004** | Client Booking Engine | 45 hrs | 25 hrs | 70 hrs | Scheduled |
| **005** | Private Client Proofing Galleries | 40 hrs | 25 hrs | 65 hrs | Scheduled |
| **006** | Learning Hub & Workshops | 35 hrs | 20 hrs | 55 hrs | Scheduled |
| **007** | Admin & Photographer CRM Dashboard | 50 hrs | 30 hrs | 80 hrs | Scheduled |
| **008** | E2E Testing & Final Deployment | 25 hrs | 30 hrs | 55 hrs | Scheduled |
| **Total Projected** | Full Platform Scope | **325 hrs** | **214 hrs** | **539 hrs** |

---

## 4. Estimated Operating Costs (Future Production Scenarios)

If the photographer launches FrameLearn as a standalone commercial platform:

| Expense Item | Frequency | Estimated Cost Range | Justification / Need |
|---|---|---|---|
| Custom Domain Name (`.com` or `.photo`) | Annual | $12.00 – $35.00 / yr | Essential for professional brand credibility. |
| Supabase Pro Tier | Monthly | $25.00 / mo ($300 / yr) | Required for production reliability: eliminates project pausing, provides daily backups, 8 GB database. |
| Vercel Pro Plan | Monthly | $20.00 / mo ($240 / yr) | Necessary for commercial commercial use and SLA. |
| Cloud Image Storage (S3 / R2 / Supabase Storage) | Monthly | $5.00 – $15.00 / mo | Scales with high-resolution photography proofing volumes (e.g., 50 GB - 250 GB). |
| **Estimated Commercial Total** | Annual | **~$600.00 – $800.00 / yr** | Standard operating budget for professional independent creative portal. |

---

## 5. Optional Purchases (Evaluated but Deferred)
- **Transactional Email Service (Resend / SendGrid)**: Free tiers offer 100 emails/day; paid tier ~$15-20/mo only needed if booking volumes scale significantly.
- **SMS Notifications (Twilio)**: Deferred until Milestone 004 bookings create a demonstrable requirement.
- **Payment Gateway (Paystack / Stripe)**: Pay-as-you-go transaction percentage fees; zero upfront purchase required.

---

## 6. Items Requiring Verification
- Verification of Supabase auto-pause behavior during vacation/breaks.
- Verification of high-resolution image compression limits to prevent exceeding storage quotas.
- Verification of institutional or educational credits for cloud infrastructure.
