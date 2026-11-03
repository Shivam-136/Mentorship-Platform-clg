import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Code2,
  Briefcase,
  Layers,
  Cpu,
  Users,
  Compass,
  CheckCircle2,
  CalendarCheck,
  Video,
  FileCheck,
  ChevronDown,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MentorCard from '../../components/cards/MentorCard';
import EmptyState from '../../components/ui/EmptyState';
import { mentorService } from '../../services/mentorService';

const DISCIPLINES = [
  {
    name: 'Software & System Design',
    description: 'Distributed systems, high-throughput pipelines, Go/Rust/Java architecture, and Staff+ design interviews.',
    icon: Code2,
    tag: 'System Design',
  },
  {
    name: 'Engineering Leadership',
    description: 'Transitioning from senior IC to Staff, Principal, or Engineering Manager with cross-functional leverage.',
    icon: Users,
    tag: 'Engineering Management',
  },
  {
    name: 'Product Strategy & PLG',
    description: 'Product-led growth, PRD tearing down, customer-centric roadmap prioritization, and PM leadership.',
    icon: Briefcase,
    tag: 'Product Strategy',
  },
  {
    name: 'AI, LLMs & Frontier Tech',
    description: 'Multimodal model fine-tuning, RAG pipelines, PyTorch production architectures, and ML systems.',
    icon: Cpu,
    tag: 'Generative AI',
  },
  {
    name: 'Cloud & Distributed Infra',
    description: 'Kubernetes orchestration, AWS/GCP cost optimization, resilience engineering, and zero-downtime releases.',
    icon: Layers,
    tag: 'Cloud Architecture',
  },
  {
    name: 'Career & Executive Presence',
    description: 'Executive communication, negotiating Staff+ compensation packages, and strategic promotion packets.',
    icon: Compass,
    tag: 'Career Growth',
  },
];

const PLATFORM_STANDARDS = [
  {
    title: 'Verified Practitioner Vetting',
    description: 'Every mentor passes manual screening verifying corporate employment, 5+ years of production experience, and proven coaching ability.',
    icon: ShieldCheck,
  },
  {
    title: 'Zero Subscription Lock-In',
    description: 'No recurring monthly retainers or mandatory minimums. Book targeted 1-on-1 sessions on-demand whenever you hit an inflection point.',
    icon: CalendarCheck,
  },
  {
    title: 'Actionable Session Teardowns',
    description: 'Sessions are not generic advice. Mentors review your architecture sketches, promotion packets, or codebases with unvarnished candor.',
    icon: FileCheck,
  },
  {
    title: 'Private & Secure 1-on-1 Calls',
    description: 'Private video meetings with direct calendar syncing, dedicated prep notes, and clear mutual non-disclosure expectations.',
    icon: Video,
  },
];

const HOME_FAQS = [
  {
    q: 'How does 1-on-1 mentorship work on MentorMatch?',
    a: 'Browse verified mentors by discipline, tech stack, or seniority. View their available focus areas and rates, then propose a time slot that matches your schedule. Once confirmed, you will receive an automatic Google Meet or Zoom video link along with dedicated session prep notes.',
  },
  {
    q: 'How are mentors verified?',
    a: 'Every mentor on MentorMatch is manually vetted to verify their professional background, requiring a minimum of 5+ years of verified software engineering, product, or leadership experience at scale.',
  },
  {
    q: 'Can I cancel or reschedule a scheduled session?',
    a: 'Yes. You can reschedule or cancel directly from your Mentee Bookings dashboard. Cancellations made at least 24 hours prior to the session start time trigger an automated 100% refund.',
  },
  {
    q: 'What should I prepare before my first mentorship call?',
    a: 'When booking, you can submit an agenda brief including architecture diagrams, code links, promotion self-reviews, or specific questions so your mentor prepares concrete feedback in advance.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredMentors, setFeaturedMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchFeaturedMentors() {
      try {
        setLoadingMentors(true);
        const data = await mentorService.getMentors({ limit: 3 });
        if (isMounted) {
          setFeaturedMentors(Array.isArray(data) ? data : data?.mentors || []);
        }
      } catch (err) {
        if (isMounted) {
          // No fake mentors on error; maintain empty state
          setFeaturedMentors([]);
        }
      } finally {
        if (isMounted) {
          setLoadingMentors(false);
        }
      }
    }

    fetchFeaturedMentors();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/mentors?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/mentors');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50/60 to-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Verified 1-on-1 Mentorship for Engineers & Leaders</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Accelerate your trajectory with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
                senior practitioners.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Break through complex architectural roadblocks, prepare for Staff+ engineering panels, and master product strategy through targeted, private 1-on-1 video sessions.
            </p>

            {/* Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-slate-300 rounded-2xl shadow-lg shadow-slate-200/50 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition">
                <div className="flex items-center gap-3 px-3.5 py-2 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by role, specialty (e.g. System Design, AI)..."
                    className="w-full text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                  />
                </div>
                <Button type="submit" size="md" className="w-full sm:w-auto px-6 rounded-xl">
                  Find Mentors
                </Button>
              </div>
            </form>

            {/* Specialty Quick Filter Tags */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-700">Explore:</span>
              {['System Design', 'Staff Engineer', 'Product Strategy', 'Generative AI', 'Cloud Architecture'].map((tag) => (
                <Link
                  key={tag}
                  to={`/mentors?q=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 transition shadow-2xs"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Core Value Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto border-t border-slate-200/80 text-left">
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60">
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" /> Vetted Practitioners
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Verified industry background and real production experience.</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60">
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" /> Dedicated 1-on-1 Calls
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Private video calls structured around your exact technical agenda.</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60">
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" /> Actionable Takeaways
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Written notes, architectural critique, and documented next steps.</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60">
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" /> Zero Subscriptions
                </p>
                <p className="text-[11px] text-slate-500 mt-1">On-demand hourly booking without monthly retainers or lock-ins.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
                Domain Expertise
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Specialized Mentorship Across Disciplines
              </h2>
            </div>
            <Link
              to="/mentors"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Browse all mentors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DISCIPLINES.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.name}
                  to={`/mentors?q=${encodeURIComponent(item.tag)}`}
                  className="group p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-brand-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-200 transition shadow-2xs">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-brand-600 flex items-center gap-1 pt-2 border-t border-slate-100 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore mentors</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Mentors Section (Connected to mentorService) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
                Verified Directory
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Verified Mentors
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Book direct 1-on-1 strategy sessions with practitioners vetted for real industry impact.
              </p>
            </div>
            <Link to="/mentors">
              <Button variant="outline" size="sm">
                View All Mentors
              </Button>
            </Link>
          </div>

          {loadingMentors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((skeleton) => (
                <div
                  key={skeleton}
                  className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-200" />
                    <div className="space-y-2 flex-1">
                      <div className="w-3/4 h-4 bg-slate-200 rounded" />
                      <div className="w-1/2 h-3 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-12 bg-slate-100 rounded-lg" />
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-slate-200 rounded" />
                    <div className="w-20 h-6 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Directory Open for Verified Mentors"
              description="Our directory actively screens senior engineers and engineering leaders. Are you an industry practitioner? Apply to mentor on MentorMatch."
              actionLabel="Apply to Become a Mentor"
              onAction={() => navigate('/auth/register')}
            />
          )}
        </div>
      </section>

      {/* Structured Mentorship Framework */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Clear & Transparent Flow
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              A structured framework for technical growth
            </h2>
            <p className="text-sm text-slate-600">
              Every session follows an intentional process from agenda briefing to actionable follow-up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Target Your Objective</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by verified expertise. When proposing a session, provide your PRD, system architecture diagram, or career questions so your mentor prepares concrete feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">2. High-Impact 1-on-1 Video Call</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Join your scheduled call directly with an automated Google Meet or Zoom link. Unpack technical edge cases, conduct mock system design, or refine your executive narrative.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Documented Action Milestones</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive unvarnished takeaways and concrete next steps recorded directly into your Mentee Progress tracker. Leave verified reviews based on real session value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Standards Grid */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              High Quality Assurance
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The MentorMatch Standard
            </h2>
            <p className="text-sm text-slate-600">
              Built on transparency, verified industry backgrounds, and rigorous standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORM_STANDARDS.map((std) => {
              const IconComp = std.icon;
              return (
                <Card key={std.title} className="p-6 space-y-3 bg-white">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{std.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{std.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Clear Answers
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {HOME_FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <Card key={idx} className="overflow-hidden border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180 text-brand-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to elevate your engineering trajectory?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Create an account to browse verified mentors, schedule 1-on-1 strategy sessions, and track your career growth milestones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/auth/register">
              <Button size="lg" className="w-full sm:w-auto px-8 bg-brand-500 hover:bg-brand-600 text-white shadow-lg">
                Get Started as Mentee
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 text-white border-white/20 bg-white/5 hover:bg-white/10">
                Apply to Mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
