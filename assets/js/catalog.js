/* ==========================================================================
   Meridian Financial Group — shared services catalog
   --------------------------------------------------------------------------
   The single source of truth for the products/services grid (home page),
   the service detail subpages (service.html?id=N) and the consent-gated
   "Recommended for you" personalization (personalize.js).

   Four categories mirror the site's Solutions section and footer:
     Banking · Lending · Wealth · Business
   ========================================================================== */
(function () {
  "use strict";

  var MONEY = "#0B7A4B", GOLD = "#C9A227", DEEP = "#064E3B";

  window.MFG_ICONS = {
    checking:  '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    savings:   '<circle cx="8" cy="8" r="5"/><path d="M18 8a5 5 0 1 1-6.4 4.8"/><path d="M8 6.5v3M6.7 8h2.6"/>',
    card:      '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>',
    home:      '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    refi:      '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v5h-5"/><path d="M9 13l2 2 4-4"/>',
    loan:      '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/>',
    invest:    '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
    retire:    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    advisor:   '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
    building:  '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/>',
    treasury:  '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2 13h20"/>'
  };

  /* Each service: id, category, name, tagline, blurb, icon, stat{label,value},
     features[], cta, color, tag ("popular"|"new"|null) */
  window.MFG_CATALOG = [
    /* ---- Banking ------------------------------------------------------- */
    { id: 1, category: "Banking", name: "Everyday Checking", tagline: "No monthly fees, ever",
      icon: "checking", color: MONEY, tag: "popular",
      stat: { label: "Monthly fee", value: "$0" },
      blurb: "A fee-free everyday checking account with early direct deposit, fee-free access to 55,000+ ATMs, and an award-winning mobile app.",
      features: ["No monthly maintenance fee", "Get paid up to 2 days early", "Zero-liability fraud protection", "Instant card lock in the app"],
      cta: "Open checking" },
    { id: 2, category: "Banking", name: "High-Yield Savings", tagline: "Grow your money faster",
      icon: "savings", color: MONEY, tag: null,
      stat: { label: "APY", value: "4.50%" },
      blurb: "Earn many times the national average with no minimum balance and no monthly fees. Automated savings tools help you reach every goal.",
      features: ["4.50% APY, no minimums", "Automatic round-up savings", "Create unlimited goal buckets", "FDIC insured up to $250,000"],
      cta: "Start saving" },
    { id: 3, category: "Banking", name: "Cash Rewards Card", tagline: "Earn on every purchase",
      icon: "card", color: GOLD, tag: null,
      stat: { label: "Cash back", value: "2%" },
      blurb: "Unlimited 2% cash back on every purchase with no annual fee, no category tracking, and premium travel and purchase protections.",
      features: ["Unlimited 2% cash back", "$0 annual fee", "0% intro APR for 15 months", "No foreign transaction fees"],
      cta: "Apply now" },
    /* ---- Lending ------------------------------------------------------- */
    { id: 4, category: "Lending", name: "30-Year Fixed Mortgage", tagline: "Predictable payments for life",
      icon: "home", color: MONEY, tag: "popular",
      stat: { label: "APR", value: "5.99%" },
      blurb: "Lock in a competitive fixed rate for the life of your loan with a fully digital application, dedicated loan officer, and fast approvals.",
      features: ["Fixed rate for 30 years", "Fully digital application", "Close in as few as 21 days", "Local, dedicated loan officer"],
      cta: "Get pre-qualified" },
    { id: 5, category: "Lending", name: "Mortgage Refinance", tagline: "Lower your rate or payment",
      icon: "refi", color: MONEY, tag: null,
      stat: { label: "APR from", value: "5.49%" },
      blurb: "Refinance to reduce your monthly payment, shorten your term, or tap your home's equity — with transparent pricing and no hidden fees.",
      features: ["Rate-and-term or cash-out", "No application fee", "Free rate comparison", "Skip a payment at closing"],
      cta: "See refi options" },
    { id: 6, category: "Lending", name: "Personal Loan", tagline: "Funds when you need them",
      icon: "loan", color: MONEY, tag: null,
      stat: { label: "APR from", value: "7.99%" },
      blurb: "Consolidate debt or finance a big expense with a fixed-rate personal loan, no origination fees, and same-day funding decisions.",
      features: ["Borrow $2,500–$50,000", "Fixed rates, no origination fee", "Same-day decision", "No prepayment penalty"],
      cta: "Check your rate" },
    /* ---- Wealth -------------------------------------------------------- */
    { id: 7, category: "Wealth", name: "Managed Investing", tagline: "Portfolios built around you",
      icon: "invest", color: MONEY, tag: "popular",
      stat: { label: "Advisory fee", value: "0.25%" },
      blurb: "Diversified, tax-efficient portfolios managed by Meridian, automatically rebalanced and aligned to your goals and risk tolerance.",
      features: ["Low 0.25% advisory fee", "Automatic tax-loss harvesting", "Goal-based portfolios", "Access to human advisors"],
      cta: "Start investing" },
    { id: 8, category: "Wealth", name: "Retirement · IRA & 401(k)", tagline: "Invest for the long run",
      icon: "retire", color: GOLD, tag: null,
      stat: { label: "Accounts", value: "Tax-advantaged" },
      blurb: "Traditional, Roth, and rollover IRAs plus employer 401(k) plans — with retirement planning tools and guidance from Meridian advisors.",
      features: ["Traditional, Roth & rollover IRAs", "Employer 401(k) plans", "Interactive retirement planner", "Advisor-guided contributions"],
      cta: "Plan retirement" },
    { id: 9, category: "Wealth", name: "Private Wealth Advisory", tagline: "A dedicated fiduciary advisor",
      icon: "advisor", color: MONEY, tag: null,
      stat: { label: "Guidance", value: "Fiduciary" },
      blurb: "A dedicated advisor builds a comprehensive plan across investing, tax, and estate strategy — with institutional-grade research behind every decision.",
      features: ["Dedicated fiduciary advisor", "Comprehensive financial plan", "Tax & estate coordination", "24/7 secure portfolio access"],
      cta: "Meet an advisor" },
    /* ---- Business ------------------------------------------------------ */
    { id: 10, category: "Business", name: "Business Checking", tagline: "Banking built to scale",
      icon: "building", color: MONEY, tag: null,
      stat: { label: "To open", value: "$0" },
      blurb: "A business checking account with no minimum balance, generous fee-free transactions, and integrations with the tools you already use.",
      features: ["No minimum balance", "200 fee-free transactions/mo", "Accounting integrations", "Sub-accounts for teams"],
      cta: "Open business account" },
    { id: 11, category: "Business", name: "Treasury Management", tagline: "Optimize your cash flow",
      icon: "treasury", color: MONEY, tag: null,
      stat: { label: "Tools", value: "Cash flow" },
      blurb: "Enterprise-grade receivables, payables, and liquidity tools with real-time visibility and fraud controls to keep working capital working.",
      features: ["Real-time cash positioning", "ACH & wire automation", "Positive pay fraud controls", "Dedicated treasury specialist"],
      cta: "Talk to treasury" },
    { id: 12, category: "Business", name: "Commercial Lending", tagline: "Capital to grow",
      icon: "briefcase", color: GOLD, tag: null,
      stat: { label: "Financing", value: "Tailored" },
      blurb: "Term loans, lines of credit, and commercial real estate financing structured around your growth plans by a local relationship manager.",
      features: ["Lines of credit & term loans", "Commercial real estate", "SBA-preferred lender", "Local relationship manager"],
      cta: "Explore financing" }
  ];

  window.MFG_FIND = function (id) {
    id = parseInt(id, 10);
    for (var i = 0; i < window.MFG_CATALOG.length; i++) {
      if (window.MFG_CATALOG[i].id === id) return window.MFG_CATALOG[i];
    }
    return null;
  };
})();
