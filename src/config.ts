/**
 * @fileoverview Centralised brand and content configuration.
 *
 * All copy, colors, pricing tiers, FAQ items, and social links live here so
 * the marketing site can be re-branded by editing a single file — no need to
 * touch individual components.
 *
 * @module config
 */

export const config = {
  /* ------------------------------------------------------------------ */
  /*  Brand Identity                                                     */
  /* ------------------------------------------------------------------ */
  brand: {
    /** Display name shown in the navbar and footer. */
    name: "NeuralFlow",
    /** Short tagline used in meta tags and hero badge. */
    tagline: "AI-Powered Workflow Automation",
    /** Emoji or image path used as the logo. */
    logo: "⚡",
  },

  /* ------------------------------------------------------------------ */
  /*  Color System — Warm orange / amber palette                         */
  /* ------------------------------------------------------------------ */
  colors: {
    primary: "#0EA5E9",
    primaryHover: "#0284C7",
    secondary: "#64748B",
    accent: "#10B981",
    dark: "#0F172A",
    darkAlt: "#1E293B",
    light: "#F8FAFC",
    border: "#E2E8F0",
  },

  /* ------------------------------------------------------------------ */
  /*  Hero Section                                                       */
  /* ------------------------------------------------------------------ */
  hero: {
    announcement: "🎉 Now available on iOS, Android, and Web",
    headline: "Transform Your Workflow with Intelligent Automation",
    subheadline:
      "NeuralFlow uses advanced AI to automate repetitive tasks, analyze data in real-time, and help teams achieve 10x productivity.",
    primaryCTA: "Download for Free",
    secondaryCTA: "Watch Demo",
    image:
      "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },

  /* ------------------------------------------------------------------ */
  /*  Trust Indicators                                                   */
  /* ------------------------------------------------------------------ */
  trust: {
    metrics: [
      { value: "500K+", label: "Active Users" },
      { value: "4.9/5", label: "App Store Rating" },
      { value: "150+", label: "Countries" },
      { value: "99.9%", label: "Uptime" },
    ],
    partners: ["Microsoft", "Google", "Salesforce", "Slack", "Notion", "Stripe"],
  },

  /* ------------------------------------------------------------------ */
  /*  Features                                                           */
  /* ------------------------------------------------------------------ */
  features: [
    {
      icon: "Brain",
      title: "Smart Automation",
      description:
        "AI learns your patterns and automates repetitive tasks, saving hours every day.",
    },
    {
      icon: "Zap",
      title: "Lightning Fast",
      description:
        "Optimized performance with sub-second response times, even with massive datasets.",
    },
    {
      icon: "Shield",
      title: "Enterprise Security",
      description:
        "Bank-level encryption, SOC 2 compliance, and complete data privacy.",
    },
    {
      icon: "Globe",
      title: "Universal Integration",
      description:
        "Connect with 1000+ apps and tools you already use daily.",
    },
    {
      icon: "TrendingUp",
      title: "Real-time Analytics",
      description:
        "Deep insights and predictive analytics powered by machine learning.",
    },
    {
      icon: "Users",
      title: "Team Collaboration",
      description:
        "Built for teams with advanced sharing, permissions, and workflows.",
    },
  ],

  /* ------------------------------------------------------------------ */
  /*  How It Works (3-step)                                              */
  /* ------------------------------------------------------------------ */
  howItWorks: [
    {
      step: "1",
      title: "Connect Your Tools",
      description:
        "Link your existing apps and data sources in seconds with one-click integrations.",
    },
    {
      step: "2",
      title: "AI Learns Your Workflow",
      description:
        "Our intelligent system observes patterns and suggests powerful automations.",
    },
    {
      step: "3",
      title: "Automate & Optimize",
      description:
        "Activate workflows and watch AI handle tasks while you focus on what matters.",
    },
  ],

  /* ------------------------------------------------------------------ */
  /*  Use Cases                                                          */
  /* ------------------------------------------------------------------ */
  useCases: [
    {
      title: "Sales Teams",
      description: "Automate lead scoring, follow-ups, and CRM updates",
      icon: "Target",
    },
    {
      title: "Marketing",
      description: "Schedule campaigns, analyze performance, optimize spending",
      icon: "Megaphone",
    },
    {
      title: "Operations",
      description: "Streamline processes, manage inventory, predict demand",
      icon: "Settings",
    },
    {
      title: "Customer Support",
      description: "AI-powered responses, ticket routing, sentiment analysis",
      icon: "MessageSquare",
    },
  ],

  /* ------------------------------------------------------------------ */
  /*  Benefits                                                           */
  /* ------------------------------------------------------------------ */
  benefits: [
    {
      title: "10x Productivity Boost",
      description:
        "Teams using NeuralFlow complete projects 10 times faster on average.",
      stat: "10x",
    },
    {
      title: "Save 20+ Hours Weekly",
      description:
        "Eliminate repetitive tasks and focus on high-impact work.",
      stat: "20hrs",
    },
    {
      title: "Reduce Errors by 95%",
      description:
        "AI-powered accuracy ensures consistent, error-free execution.",
      stat: "95%",
    },
  ],

  /* ------------------------------------------------------------------ */
  /*  Integrations                                                       */
  /* ------------------------------------------------------------------ */
  integrations: [
    "Slack",
    "Google Workspace",
    "Microsoft 365",
    "Salesforce",
    "HubSpot",
    "Notion",
    "Asana",
    "Jira",
    "GitHub",
    "Stripe",
    "Shopify",
    "Zapier",
  ],

  /* ------------------------------------------------------------------ */
  /*  Testimonials                                                       */
  /* ------------------------------------------------------------------ */
  testimonials: [
    {
      quote:
        "NeuralFlow transformed how our team works. We've automated 80% of our routine tasks and can focus on strategic initiatives.",
      author: "Sarah Chen",
      role: "VP of Operations",
      company: "TechCorp",
      rating: 5,
    },
    {
      quote:
        "The AI is incredibly intuitive. It learned our workflow in days and now handles tasks we didn't even know could be automated.",
      author: "Michael Rodriguez",
      role: "Head of Sales",
      company: "GrowthLabs",
      rating: 5,
    },
    {
      quote:
        "Best investment we made this year. ROI was positive within the first month. The time savings alone are worth 10x the price.",
      author: "Emily Watson",
      role: "CEO",
      company: "DataFlow Inc",
      rating: 5,
    },
  ],

  /* ------------------------------------------------------------------ */
  /*  Pricing                                                            */
  /* ------------------------------------------------------------------ */
  pricing: [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started",
      features: [
        "Up to 100 automations/month",
        "5 integrations",
        "Basic analytics",
        "Email support",
        "Mobile apps",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For professionals and growing teams",
      features: [
        "Unlimited automations",
        "Unlimited integrations",
        "Advanced AI features",
        "Real-time analytics",
        "Priority support",
        "Custom workflows",
        "Team collaboration",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "For large organizations with custom needs",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "On-premise deployment",
        "24/7 phone support",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ],

  /* ------------------------------------------------------------------ */
  /*  FAQ                                                                */
  /* ------------------------------------------------------------------ */
  faq: [
    {
      question: "How does the free plan work?",
      answer:
        "The free plan gives you full access to core features with a limit of 100 automations per month. No credit card required, cancel anytime.",
    },
    {
      question: "Can I integrate with my existing tools?",
      answer:
        "Yes! NeuralFlow integrates with 1000+ popular apps including Slack, Google Workspace, Salesforce, and many more. Custom integrations available on Enterprise plans.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use bank-level encryption, are SOC 2 compliant, and never share your data. You maintain full ownership and can export or delete anytime.",
    },
    {
      question: "How long does setup take?",
      answer:
        "Most users are up and running in under 5 minutes. Our AI guides you through setup and starts learning your workflow immediately.",
    },
    {
      question: "Do you offer support?",
      answer:
        "Yes! Free users get email support, Pro users get priority support, and Enterprise customers get 24/7 phone support with a dedicated account manager.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription anytime with no penalties. Your data remains accessible during your billing period.",
    },
  ],

  /* ------------------------------------------------------------------ */
  /*  Footer                                                             */
  /* ------------------------------------------------------------------ */
  footer: {
    description:
      "The intelligent automation platform trusted by teams worldwide.",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    links: {
      product: [
        { label: "Features", href: "#features" },
        { label: "Integrations", href: "#integrations" },
        { label: "Pricing", href: "#pricing" },
        { label: "Security", href: "#" },
      ],
      company: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
      ],
      resources: [
        { label: "Documentation", href: "#" },
        { label: "API", href: "#" },
        { label: "Support", href: "#" },
        { label: "Status", href: "#" },
      ],
      legal: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" },
      ],
    },
  },
};
