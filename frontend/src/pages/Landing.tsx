import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Database,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Workflow,
} from "lucide-react";

import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";

const HERO_IMG =
  "https://images.unsplash.com/photo-1758520144427-ddb02ac74e9d?crop=entropy&cs=srgb&fm=jpg&q=85";

const WORKFLOW_IMG =
  "https://images.unsplash.com/photo-1758691737124-05c5bffe46f0?crop=entropy&cs=srgb&fm=jpg&q=85";

const PROOF_IMG =
  "https://images.unsplash.com/photo-1758518731468-98e90ffd7430?crop=entropy&cs=srgb&fm=jpg&q=85";

const features = [
  {
    icon: Search,
    title: "Live job discovery",
    text: "Browse real job listings served directly from the IntelliHire Spring Boot backend with instant search and location filtering.",
  },
  {
    icon: ShieldCheck,
    title: "JWT authentication",
    text: "Secure login with BCrypt password hashing and JWT-based authentication for protected application requests.",
  },
  {
    icon: Building2,
    title: "Employer job publishing",
    text: "Create and publish job openings through a validated form backed by a real REST API and MySQL database.",
  },
  {
    icon: Workflow,
    title: "Role-based foundation",
    text: "The platform architecture separates candidate, recruiter and admin experiences for future workflow expansion.",
  },
];

const technicalHighlights = [
  {
    icon: LockKeyhole,
    title: "Secure request flow",
    text: "JWT tokens are validated through a Spring Security filter before protected resources are accessed.",
  },
  {
    icon: Database,
    title: "Persistent data",
    text: "User and job data are persisted through Hibernate JPA and MySQL rather than browser-only state.",
  },
  {
    icon: UserRound,
    title: "Real user identity",
    text: "Authenticated sessions retrieve the current user's profile from the backend through GET /auth/me.",
  },
  {
    icon: CheckCircle2,
    title: "Honest product design",
    text: "Unsupported workflows are clearly marked instead of displaying fabricated applicants, analytics or AI results.",
  },
];

const currentFlow = [
  "Create an IntelliHire account",
  "Sign in securely",
  "Browse live job openings",
  "Publish a job as an authenticated user",
];

const aiRoadmap = [
  "Resume analysis",
  "Semantic candidate matching",
  "Interview question generation",
];

export default function Landing() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_80%_-10%,rgba(67,56,202,0.10),transparent)] dark:bg-[radial-gradient(60rem_40rem_at_80%_-10%,rgba(99,102,241,0.14),transparent)]" />

        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <div className="flex flex-col justify-center lg:col-span-7">
            <Badge tone="brand" className="w-fit animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              Intelligent Recruitment Platform
            </Badge>

            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-6xl">
              Build better hiring workflows with IntelliHire.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              A full-stack recruitment platform built with React and Spring
              Boot, combining secure authentication, live job management and a
              foundation for future AI-powered hiring.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/jobs">
                <Button
                  size="lg"
                  data-testid="hero-explore-jobs-btn"
                >
                  Explore jobs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {!isAuthenticated ? (
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    data-testid="hero-register-btn"
                  >
                    Create account
                  </Button>
                </Link>
              ) : (
                <Link to="/jobs/new">
                  <Button
                    size="lg"
                    variant="outline"
                    data-testid="hero-post-job-btn"
                  >
                    Post a job
                  </Button>
                </Link>
              )}
            </div>

            {isAuthenticated && user && (
              <div className="mt-6 flex w-fit items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-800 dark:border-brand-900 dark:bg-brand-500/10 dark:text-brand-200">
                <CheckCircle2 className="h-4 w-4" />
                Welcome back, <span className="font-semibold">{user.name}</span>
              </div>
            )}

            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-slate-200 pt-8 dark:border-slate-800">
              <div>
                <dt className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
                  JWT
                </dt>
                <dd className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Authentication
                </dd>
              </div>

              <div>
                <dt className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
                  REST
                </dt>
                <dd className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  API architecture
                </dd>
              </div>

              <div>
                <dt className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
                  MySQL
                </dt>
                <dd className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Persistent data
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <img
                src={HERO_IMG}
                alt="Recruitment team collaborating in a modern workplace"
                className="aspect-[4/5] w-full rounded-2xl border border-slate-200 object-cover shadow-elevated dark:border-slate-800"
                loading="eager"
              />

              <div className="absolute -bottom-5 -left-5 hidden w-60 rounded-xl border border-slate-200 bg-white p-4 shadow-elevated dark:border-slate-800 dark:bg-slate-900 sm:block">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-semibold">
                    Backend connected
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  React + Spring Boot + MySQL
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core features */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Platform capabilities</p>

          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
            A solid recruitment platform foundation
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            IntelliHire currently focuses on a real authentication and job
            management workflow while keeping the architecture ready for a
            larger recruitment lifecycle.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="surface-card p-6 transition-transform hover:-translate-y-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                <feature.icon className="h-5 w-5" />
              </span>

              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Current workflow */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Current workflow</p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
              A real end-to-end foundation
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              The current implementation connects the browser, Spring Boot
              REST APIs and MySQL persistence into one working product flow.
            </p>

            <ol className="mt-8 space-y-4">
              {currentFlow.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white dark:bg-brand-600">
                    {index + 1}
                  </span>

                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/jobs">
                <Button size="sm">
                  Browse live jobs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {isAuthenticated && (
                <Link to="/jobs/new">
                  <Button size="sm" variant="outline">
                    Publish a job
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <img
            src={WORKFLOW_IMG}
            alt="Recruitment professionals collaborating"
            className="aspect-[5/4] w-full rounded-2xl border border-slate-200 object-cover shadow-elevated dark:border-slate-800"
            loading="lazy"
          />
        </div>
      </section>

      {/* Technical architecture */}
      <section className="container-page py-20">
        <div className="surface-card overflow-hidden">
          <div className="grid gap-10 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <p className="eyebrow">Engineering foundation</p>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Built as a real full-stack application
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                IntelliHire is structured so each layer has a clear
                responsibility: React handles the interface, Axios handles
                API communication, Spring Boot provides the REST backend and
                MySQL persists application data.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "React + TypeScript",
                  "Vite",
                  "Axios",
                  "Spring Boot",
                  "Spring Security",
                  "JWT",
                  "Hibernate JPA",
                  "MySQL",
                ].map((technology) => (
                  <Badge key={technology} tone="brand">
                    {technology}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {technicalHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 p-5 dark:border-slate-800"
                >
                  <item.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />

                  <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI roadmap */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page py-20">
          <div className="surface-card overflow-hidden">
            <div className="grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white dark:bg-brand-600">
                    <BrainCircuit className="h-5 w-5" />
                  </span>

                  <Badge tone="amber">
                    AI roadmap · Future integration
                  </Badge>
                </div>

                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-3xl">
                  AI capabilities are the next layer
                </h2>

                <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                  The current application focuses on the core recruitment
                  infrastructure first. Spring AI can later extend it with
                  intelligent candidate and hiring workflows.
                </p>

                <div className="mt-6 space-y-3">
                  {aiRoadmap.map((feature, index) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                        {index + 1}
                      </span>

                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-800/40">
                <div className="max-w-sm text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-brand-600 dark:text-brand-400" />

                  <p className="mt-4 font-display text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Spring AI integration planned
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    AI features are intentionally not simulated in the current
                    release. They will connect to real backend services once
                    implemented.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="container-page py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src={PROOF_IMG}
            alt="Professionals collaborating in an enterprise environment"
            className="aspect-[5/4] w-full rounded-2xl border border-slate-200 object-cover shadow-elevated dark:border-slate-800"
            loading="lazy"
          />

          <div>
            <p className="eyebrow">Why this project matters</p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
              From a simple job portal to an extensible hiring platform
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              IntelliHire demonstrates the core engineering skills required
              for a modern enterprise application: API design, authentication,
              persistence, frontend integration and a clean foundation for
              future intelligent features.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                <Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />

                <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Multi-role architecture
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Candidate, recruiter and admin experiences are separated at
                  the application level.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />

                <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Security-first core
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Authentication and authorization are handled through the
                  backend rather than trusted browser state alone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page py-20">
        <div className="relative overflow-hidden rounded-2xl bg-brand-800 px-8 py-14 text-center dark:bg-brand-700 sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(30rem_20rem_at_50%_-20%,rgba(255,255,255,0.16),transparent)]" />

          <h2 className="relative font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Explore IntelliHire
          </h2>

          <p className="relative mx-auto mt-4 max-w-xl text-base leading-7 text-brand-100">
            See the live job board, authenticate securely and experience the
            current full-stack workflow.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/jobs">
              <Button
                size="lg"
                className="bg-white text-brand-800 hover:bg-brand-50"
                data-testid="cta-jobs-btn"
              >
                Explore jobs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            {!isAuthenticated && (
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                  data-testid="cta-register-btn"
                >
                  Create account
                </Button>
              </Link>
            )}

            {isAuthenticated && (
              <Link to="/jobs/new">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                  data-testid="cta-post-job-btn"
                >
                  Post a job
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}