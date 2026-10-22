/* ==========================================================================
   Halvora Health & Financial — shared services catalog
   --------------------------------------------------------------------------
   The single source of truth for the products/services grid (home page),
   the service detail subpages (service.html?id=N) and the consent-gated
   "Recommended for you" personalization (personalize.js).

   Four categories mirror the site's Solutions section and footer:
     Health Savings · Wellness · Investing · Employers
   Halvora is a fictitious brand; every product, figure and feature below is
   illustrative demo content.
   ========================================================================== */
(function () {
  "use strict";

  var MONEY = "#0B7A4B", GOLD = "#C9A227", DEEP = "#064E3B";

  window.MFG_ICONS = {
    shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v6M9 11h6"/>',
    card:     '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>',
    receipt:  '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    pulse:    '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    stetho:   '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>',
    calc:     '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h4"/>',
    invest:   '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
    sunrise:  '<path d="M12 2v8M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M8 6l4-4 4 4M16 18a4 4 0 0 0-8 0"/>',
    coach:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/>',
    layers:   '<path d="m12 2 10 5-10 5L2 7l10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    chart:    '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="5" width="3" height="12"/>'
  };

  /* Each service: id, category, name, tagline, blurb, icon, stat{label,value},
     features[], cta, color, tag ("popular"|"new"|null) */
  window.MFG_CATALOG = [
    /* ---- Health Savings ------------------------------------------------ */
    { id: 1, category: "Health Savings", name: "Halvora HSA", tagline: "Triple tax advantage, $0 fees",
      icon: "shield", color: MONEY, tag: "popular",
      stat: { label: "Monthly fee", value: "$0" },
      blurb: "A health savings account that pairs with your HSA-qualified health plan. Contributions can lower your taxable income, growth is tax-free, and withdrawals for qualified medical expenses are tax-free too.",
      features: ["$0 monthly fees, no minimums", "Your balance rolls over every year", "Keep it when you change jobs", "Pairs with HSA-qualified health plans"],
      cta: "Open an HSA" },
    { id: 2, category: "Health Savings", name: "Smart Spend Card", tagline: "Pay for care in one tap",
      icon: "card", color: MONEY, tag: null,
      stat: { label: "Card fee", value: "$0" },
      blurb: "Use your Halvora debit card at the pharmacy, dentist, or doctor's office. We flag likely-eligible purchases automatically and keep every receipt organized.",
      features: ["Accepted at pharmacies and providers", "Flags likely-eligible expenses", "Instant card lock in the app", "Works with digital wallets"],
      cta: "Get your card" },
    { id: 3, category: "Health Savings", name: "Receipt Vault", tagline: "Save now, reimburse later",
      icon: "receipt", color: GOLD, tag: null,
      stat: { label: "Receipt storage", value: "Unlimited" },
      blurb: "Pay out of pocket today, let your HSA keep growing, and reimburse yourself later. Receipt Vault keeps every qualified expense organized so you're always ready.",
      features: ["Snap and store receipts", "Track unreimbursed expenses", "One-tap reimbursements", "Year-end tax summary"],
      cta: "Organize receipts" },
    /* ---- Wellness ------------------------------------------------------ */
    { id: 4, category: "Wellness", name: "Healthy Habits Rewards", tagline: "Get rewarded for feeling better",
      icon: "pulse", color: MONEY, tag: "popular",
      stat: { label: "Earn up to", value: "$300/yr" },
      blurb: "Set small, realistic goals for walking, sleep, and preventive checkups, and earn contributions to your HSA when your employer sponsors the program. Healthier routines, stronger savings.",
      features: ["Personal daily and weekly goals", "Syncs with popular fitness apps", "Employer-funded HSA rewards", "You control what you share"],
      cta: "Start a habit" },
    { id: 5, category: "Wellness", name: "Preventive Care Navigator", tagline: "Stay ahead of your health",
      icon: "stetho", color: MONEY, tag: null,
      stat: { label: "Checkup reminders", value: "Personal" },
      blurb: "See which screenings and checkups are recommended for your age, find in-network providers, and learn which preventive services your plan may cover before you meet your deductible.",
      features: ["Age-based screening checklist", "Find in-network providers", "Reminders on your schedule", "Track visits in one place"],
      cta: "Plan my checkups" },
    { id: 6, category: "Wellness", name: "Care Cost Estimator", tagline: "Know the price before you go",
      icon: "calc", color: GOLD, tag: null,
      stat: { label: "Price checks", value: "Free" },
      blurb: "Compare estimated prices for common visits, procedures, and prescriptions before you book, then pay with your HSA and keep more of your money working for you.",
      features: ["Compare provider prices", "Prescription price checks", "See what you may owe after insurance", "Pay directly from your HSA"],
      cta: "Estimate a cost" },
    /* ---- Investing ----------------------------------------------------- */
    { id: 7, category: "Investing", name: "HSA Investing", tagline: "Grow tax-free for the long run",
      icon: "invest", color: MONEY, tag: "popular",
      stat: { label: "Portfolio fee from", value: "0.15%" },
      blurb: "Invest the HSA dollars above your cash cushion in diversified, low-cost portfolios. Growth is tax-free, and the money is there for medical costs today or decades from now.",
      features: ["Low-cost diversified portfolios", "Set your own cash cushion", "Automatic rebalancing", "No investing minimum"],
      cta: "Start investing" },
    { id: 8, category: "Investing", name: "Retirement Health Planner", tagline: "Plan for healthcare in retirement",
      icon: "sunrise", color: GOLD, tag: null,
      stat: { label: "Planning horizon", value: "Lifetime" },
      blurb: "Estimate future healthcare costs and see how your HSA can help cover them. After age 65, withdrawals for non-medical expenses are taxed as income but no longer carry the additional penalty.",
      features: ["Project retirement care costs", "Model contributions and growth", "Medicare-ready planning", "Works alongside your 401(k) and IRA"],
      cta: "Plan ahead" },
    { id: 9, category: "Investing", name: "Health & Wealth Coaching", tagline: "One guide for body and budget",
      icon: "coach", color: MONEY, tag: null,
      stat: { label: "Coaching", value: "1:1" },
      blurb: "Meet with a financial coach and a wellness coach who work from the same plan, so your health goals and your money goals move forward together.",
      features: ["Certified financial coaches", "Credentialed wellness coaches", "One shared action plan", "Video or phone sessions"],
      cta: "Meet a coach" },
    /* ---- Employers ----------------------------------------------------- */
    { id: 10, category: "Employers", name: "Employer HSA Program", tagline: "Benefits people actually use",
      icon: "building", color: MONEY, tag: null,
      stat: { label: "Setup fee", value: "$0" },
      blurb: "Offer Halvora HSAs alongside your HSA-qualified health plans, with payroll integration, employer contributions, and onboarding that helps employees get the most from their benefits.",
      features: ["Payroll and benefits integrations", "Flexible employer contributions", "Employee education toolkit", "Dedicated implementation team"],
      cta: "Talk to our team" },
    { id: 11, category: "Employers", name: "Benefits Administration", tagline: "One home for every account",
      icon: "layers", color: MONEY, tag: null,
      stat: { label: "Accounts", value: "HSA · FSA · HRA" },
      blurb: "Run HSAs, FSAs, HRAs, and lifestyle spending accounts from a single dashboard, with clear reporting and compliance support built in.",
      features: ["HSA, FSA, HRA and LSA support", "Single employer dashboard", "Compliance reminders", "Simple employee claims"],
      cta: "See the platform" },
    { id: 12, category: "Employers", name: "Wellbeing Insights", tagline: "Privacy-first program reporting",
      icon: "chart", color: GOLD, tag: null,
      stat: { label: "Reporting", value: "De-identified" },
      blurb: "Understand program participation and savings trends through aggregated, de-identified reporting that never exposes individual health details, so you can improve benefits while respecting employee privacy.",
      features: ["Aggregated, de-identified data", "Participation and savings trends", "No individual health details", "Consent-aware by design"],
      cta: "Explore insights" }
  ];

  window.MFG_FIND = function (id) {
    id = parseInt(id, 10);
    for (var i = 0; i < window.MFG_CATALOG.length; i++) {
      if (window.MFG_CATALOG[i].id === id) return window.MFG_CATALOG[i];
    }
    return null;
  };
})();
