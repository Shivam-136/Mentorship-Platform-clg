// Realistic Mock Data for Mentorship Platform

export const MOCK_MENTORS = [
  {
    id: "mentor-1",
    name: "Dr. Sarah Jenkins",
    title: "Principal Engineer at Stripe",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    rating: 4.95,
    reviewsCount: 142,
    sessionsCount: 380,
    hourlyRate: 120,
    company: "Stripe",
    experience: "12+ years",
    bio: "Ex-Google tech lead specializing in scalable distributed systems, cloud architecture, and engineering leadership. Passionate about helping mid-level engineers make the leap to senior and staff roles.",
    skills: ["System Design", "Cloud Architecture", "Distributed Systems", "Career Growth", "Go", "Kubernetes"],
    languages: ["English", "German"],
    featured: true,
    availableNext: "Tomorrow at 4:00 PM",
    education: "Ph.D. in Computer Science, Stanford University",
    location: "San Francisco, CA (PST)",
    about: "I've spent over a decade leading core infrastructure and payment orchestration pipelines. My sessions focus on high-impact architectural thinking, breaking down complex distributed problems, and navigating political & executive dynamics as a technical leader.",
    topics: [
      { title: "System Design Mock Interview", duration: "60 mins", price: 120 },
      { title: "Staff+ Career Roadmap Review", duration: "45 mins", price: 95 },
      { title: "Technical Architecture Deep Dive", duration: "60 mins", price: 130 }
    ]
  },
  {
    id: "mentor-2",
    name: "Alex Rivera",
    title: "Head of Product at Linear",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    rating: 4.98,
    reviewsCount: 210,
    sessionsCount: 520,
    hourlyRate: 150,
    company: "Linear",
    experience: "10+ years",
    bio: "Product strategist focused on craft-driven software, product-led growth (PLG), and 0-to-1 execution. Helping aspiring PMs and founders build products people love.",
    skills: ["Product Strategy", "PLG", "UX Research", "Roadmapping", "Design Systems", "Pitching"],
    languages: ["English", "Spanish"],
    featured: true,
    availableNext: "Thursday at 2:00 PM",
    education: "B.S. in Cognitive Science, UC Berkeley",
    location: "New York, NY (EST)",
    about: "Great products happen when craftsmanship intersects with deep customer empathy. In my sessions, we refine your PRDs, analyze your growth metrics, or practice intense PM interview questions with real feedback.",
    topics: [
      { title: "Product Sense & Execution Interview", duration: "60 mins", price: 150 },
      { title: "Portfolio & PRD Review", duration: "45 mins", price: 110 },
      { title: "Transitioning into PM", duration: "45 mins", price: 100 }
    ]
  },
  {
    id: "mentor-3",
    name: "Marcus Vance",
    title: "Senior Staff AI Researcher at OpenAI",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    rating: 4.92,
    reviewsCount: 98,
    sessionsCount: 240,
    hourlyRate: 180,
    company: "OpenAI",
    experience: "8+ years",
    bio: "Deep learning practitioner working on multimodal LLMs and RLHF. Mentoring machine learning engineers and researchers targeting frontier AI labs.",
    skills: ["Generative AI", "LLMs", "PyTorch", "Reinforcement Learning", "NLP", "AI Ethics"],
    languages: ["English"],
    featured: true,
    availableNext: "Friday at 10:00 AM",
    education: "M.S. in Machine Learning, Carnegie Mellon University",
    location: "Seattle, WA (PST)",
    about: "The AI landscape moves at breakneck speed. I help engineers master foundational mathematics, understand modern transformer architectures, and design production AI workflows.",
    topics: [
      { title: "AI/ML Career Strategy & Lab Entry", duration: "60 mins", price: 180 },
      { title: "Fine-Tuning & RAG Architecture", duration: "60 mins", price: 180 }
    ]
  },
  {
    id: "mentor-4",
    name: "Elena Rostova",
    title: "Design Director at Figma",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    rating: 4.99,
    reviewsCount: 165,
    sessionsCount: 410,
    hourlyRate: 130,
    company: "Figma",
    experience: "11+ years",
    bio: "Passionate design leader obsessed with micro-interactions, cohesive typography, and cross-functional design engineering. Former Airbnb design lead.",
    skills: ["Design Systems", "UI/UX Design", "Interaction Design", "Portfolio Critique", "Figma", "Design Ops"],
    languages: ["English", "French"],
    featured: false,
    availableNext: "Wednesday at 5:00 PM",
    education: "BFA in Interaction Design, RISD",
    location: "London, UK (GMT)",
    about: "I bridge the gap between design vision and technical execution. We'll overhaul your case studies, elevate your visual polish, and practice whiteboard challenges.",
    topics: [
      { title: "Senior Portfolio Teardown", duration: "60 mins", price: 130 },
      { title: "Design System Architecture", duration: "60 mins", price: 130 }
    ]
  },
  {
    id: "mentor-5",
    name: "David Kim",
    title: "VP of Engineering at Datadog",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    rating: 4.90,
    reviewsCount: 84,
    sessionsCount: 190,
    hourlyRate: 160,
    company: "Datadog",
    experience: "15+ years",
    bio: "Executive leader scaling high-output engineering organizations from 20 to 300+ developers. Expert in engineering culture, OKRs, and manager transitions.",
    skills: ["Engineering Management", "Scaling Teams", "Executive Communication", "Org Design", "DevOps"],
    languages: ["English", "Korean"],
    featured: false,
    availableNext: "Monday at 11:00 AM",
    education: "B.S. in Electrical & Computer Eng, Georgia Tech",
    location: "Austin, TX (CST)",
    about: "Managing people is very different from managing code. I mentor new and experienced engineering managers on driving team alignment, managing performance, and surviving hypergrowth.",
    topics: [
      { title: "Transitioning from IC to EM", duration: "60 mins", price: 160 },
      { title: "Engineering Culture & Scaling", duration: "60 mins", price: 160 }
    ]
  },
  {
    id: "mentor-6",
    name: "Amina Al-Mansoor",
    title: "Lead Frontend Architect at Shopify",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300",
    rating: 4.96,
    reviewsCount: 115,
    sessionsCount: 290,
    hourlyRate: 110,
    company: "Shopify",
    experience: "9+ years",
    bio: "Web performance specialist and React contributor. Passionate about web vitals, accessibility (a11y), modern state management, and developer experience.",
    skills: ["React", "Next.js", "Web Performance", "TypeScript", "Accessibility", "Frontend Architecture"],
    languages: ["English", "Arabic"],
    featured: false,
    availableNext: "Tomorrow at 6:00 PM",
    education: "B.S. in Software Engineering, McGill University",
    location: "Toronto, Canada (EST)",
    about: "Speed is a feature. I help developers pinpoint bottlenecks in complex web apps, design clean component hierarchies, and prepare for tough frontend interviews.",
    topics: [
      { title: "Frontend Mock Interview & Coding", duration: "60 mins", price: 110 },
      { title: "Core Web Vitals & Performance Audit", duration: "45 mins", price: 90 }
    ]
  }
];

export const MOCK_REVIEWS = [
  {
    id: "rev-1",
    author: "Jessica Chen",
    role: "Senior Software Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    date: "2 days ago",
    mentorName: "Dr. Sarah Jenkins",
    comment: "Sarah provided the most actionable feedback on my distributed consensus draft. Her insights on production edge cases helped me pass my Staff Eng panel at Meta!"
  },
  {
    id: "rev-2",
    author: "Michael Brookes",
    role: "Associate Product Manager",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    date: "1 week ago",
    mentorName: "Alex Rivera",
    comment: "Alex is phenomenal. He dismantled my PRD and reconstructed it with customer-centric metrics. In just two sessions, my confidence skyrocketed."
  },
  {
    id: "rev-3",
    author: "Tariq Edwards",
    role: "Machine Learning Researcher",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    date: "2 weeks ago",
    mentorName: "Marcus Vance",
    comment: "Marcus helped me understand RLHF reward modeling nuances that aren't documented in papers. Unbelievable depth of knowledge."
  }
];

export const MOCK_BOOKINGS = [
  {
    id: "bk-101",
    mentorId: "mentor-1",
    mentorName: "Dr. Sarah Jenkins",
    mentorTitle: "Principal Engineer at Stripe",
    menteeName: "Jordan Hayes",
    menteeRole: "Software Engineer",
    topic: "System Design Mock Interview (Distributed KV Store)",
    date: "Oct 12, 2026",
    time: "4:00 PM - 5:00 PM PST",
    status: "Upcoming",
    meetUrl: "https://meet.google.com/xyz-ment-app",
    price: 120,
    notes: "Focusing on partitioning, replica replication, and raft consensus."
  },
  {
    id: "bk-102",
    mentorId: "mentor-2",
    mentorName: "Alex Rivera",
    mentorTitle: "Head of Product at Linear",
    menteeName: "Jordan Hayes",
    menteeRole: "Software Engineer",
    topic: "Product Sense & Execution Interview Prep",
    date: "Oct 18, 2026",
    time: "2:00 PM - 3:00 PM EST",
    status: "Confirmed",
    meetUrl: "https://meet.google.com/lin-ear-ment",
    price: 150,
    notes: "Preparing for product leader transition."
  },
  {
    id: "bk-103",
    mentorId: "mentor-6",
    mentorName: "Amina Al-Mansoor",
    mentorTitle: "Lead Frontend Architect at Shopify",
    menteeName: "Jordan Hayes",
    menteeRole: "Software Engineer",
    topic: "Frontend Architecture & Web Vitals Audit",
    date: "Sep 28, 2026",
    time: "6:00 PM - 7:00 PM EST",
    status: "Completed",
    meetUrl: "#",
    price: 110,
    ratingGiven: 5,
    feedbackGiven: "Amina broke down hydration bottlenecks in a way that made immediate sense. Highly recommended!"
  },
  {
    id: "bk-104",
    mentorId: "mentor-4",
    mentorName: "Elena Rostova",
    mentorTitle: "Design Director at Figma",
    menteeName: "Jordan Hayes",
    menteeRole: "Software Engineer",
    topic: "Portfolio Review & Presentation Critique",
    date: "Sep 14, 2026",
    time: "5:00 PM - 6:00 PM GMT",
    status: "Completed",
    meetUrl: "#",
    price: 130,
    ratingGiven: 5,
    feedbackGiven: "World-class visual feedback."
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Session Confirmed",
    description: "Dr. Sarah Jenkins confirmed your System Design Mock Interview for Oct 12, 2026.",
    time: "10 minutes ago",
    unread: true,
    type: "session"
  },
  {
    id: "notif-2",
    title: "New Booking Request",
    description: "Carlos Santana requested a 45-min Career Roadmap session for Friday.",
    time: "1 hour ago",
    unread: true,
    type: "request"
  },
  {
    id: "notif-3",
    title: "Review Received",
    description: "Jessica Chen left a 5-star review: 'Outstanding mentorship session!'",
    time: "1 day ago",
    unread: false,
    type: "review"
  },
  {
    id: "notif-4",
    title: "Payment Processed",
    description: "Payout of $360.00 has been sent to your registered bank account.",
    time: "3 days ago",
    unread: false,
    type: "payment"
  }
];

export const MOCK_CATEGORIES = [
  { name: "Software Engineering", count: 124, icon: "Code" },
  { name: "Product Management", count: 86, icon: "Briefcase" },
  { name: "UI/UX & Product Design", count: 72, icon: "Palette" },
  { name: "Artificial Intelligence & ML", count: 54, icon: "Cpu" },
  { name: "Leadership & Management", count: 48, icon: "Users" },
  { name: "Career Transition & Growth", count: 95, icon: "TrendingUp" }
];

export const MOCK_FAQS = [
  {
    q: "How does 1-on-1 mentorship work?",
    a: "Browse vetted industry mentors by domain, filter by experience or price, and book a time slot directly on their calendar. You will receive an instant Google Meet or Zoom link, along with dedicated prep notes."
  },
  {
    q: "Can I cancel or reschedule a session?",
    a: "Yes! Sessions can be rescheduled or cancelled with full refund up to 24 hours before the scheduled start time directly from your bookings dashboard."
  },
  {
    q: "How are mentors vetted?",
    a: "Every mentor on MentorMatch passes through a rigorous screening process verifying their verified corporate employment, minimum 5+ years of relevant industry experience, and proven track record of coaching."
  },
  {
    q: "What is the difference between Mentee and Mentor accounts?",
    a: "Mentees have access to mentor search, booking management, session notes, and personalized career roadmaps. Mentors receive a dedicated portal for setting availability, receiving booking requests, tracking earnings, and reviewing mentee briefs."
  },
  {
    q: "Are the sessions recorded?",
    a: "By default sessions are private between you and your mentor. If both parties agree, you can record the session for your personal study and future reference."
  }
];
