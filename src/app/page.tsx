'use client';
import Link from 'next/link';
import styles from './page.module.css';

const features = [
  {
    icon: '✦',
    title: 'AI-Powered Writing',
    desc: 'Our AI crafts compelling bullet points, summaries, and skills tailored to your industry.',
    color: '--accent-purple',
  },
  {
    icon: '⚡',
    title: 'Instant Generation',
    desc: 'Go from blank page to polished resume in under 3 minutes. No writer\'s block, ever.',
    color: '--accent-cyan',
  },
  {
    icon: '◎',
    title: 'ATS Optimized',
    desc: 'Every resume is formatted to pass Applicant Tracking Systems and reach human eyes.',
    color: '--accent-pink',
  },
  {
    icon: '↓',
    title: 'PDF Export',
    desc: 'Download a pixel-perfect PDF resume ready to send to any employer instantly.',
    color: '--accent-emerald',
  },
];

const steps = [
  { step: '01', title: 'Enter Your Details', desc: 'Fill in your experience, skills, and education. Our smart form makes it effortless.' },
  { step: '02', title: 'AI Enhances It', desc: 'Click "Generate with AI" and watch our AI craft professional, impactful content.' },
  { step: '03', title: 'Download & Apply', desc: 'Preview your polished resume and download a print-ready PDF in one click.' },
];

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className="gradient-text">ResumeAI</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          </div>
          <Link href="/builder" className="btn btn-primary" id="nav-cta">
            Build My Resume →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className="badge badge-purple">
            <span>✦</span> AI-Powered · Available 24/7 · Free to Use
          </span>
        </div>
        <h1 className={styles.heroTitle}>
          Build a Resume That<br />
          <span className="gradient-text">Gets You Hired</span>
        </h1>
        <p className={styles.heroSub}>
          Stop spending hours on formatting. Our AI writes professional, ATS-optimized resumes
          in minutes — tailored to your career, available around the clock.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/builder" className="btn btn-primary" id="hero-cta-primary" style={{ fontSize: '16px', padding: '16px 36px' }}>
            ✦ Build My Resume — It's Free
          </Link>
          <a href="#how-it-works" className="btn btn-secondary" id="hero-cta-secondary">
            See How It Works
          </a>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>50K+</span>
            <span className={styles.statLabel}>Resumes Created</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>24/7</span>
            <span className={styles.statLabel}>Always Available</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>3 min</span>
            <span className={styles.statLabel}>Average Build Time</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <span className="badge badge-purple">Features</span>
            <h2 className={styles.sectionTitle}>Everything You Need to Stand Out</h2>
            <p className={styles.sectionSub}>Powerful AI tools designed to make your resume shine above the competition.</p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} className={`card ${styles.featureCard}`} id={`feature-${i}`}>
                <div className={styles.featureIcon} style={{ color: `var(${f.color})` }}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.section} style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <span className="badge badge-cyan">How It Works</span>
            <h2 className={styles.sectionTitle}>From Zero to Hired in 3 Steps</h2>
            <p className={styles.sectionSub}>Our streamlined process makes resume building completely stress-free.</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map((s, i) => (
              <div key={i} className={styles.stepCard} id={`step-${i}`}>
                <div className={styles.stepNum}>{s.step}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
                {i < steps.length - 1 && <div className={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerInner}>
          <h2 className={styles.ctaBannerTitle}>Ready to Land Your Dream Job?</h2>
          <p className={styles.ctaBannerSub}>
            Join thousands of professionals who built their career with ResumeAI. No sign-up needed.
          </p>
          <Link href="/builder" className="btn btn-primary" id="cta-banner-btn" style={{ fontSize: '16px', padding: '16px 40px' }}>
            Start Building Now — Free →
          </Link>
        </div>
      </section>

      {/* Support & Contact Banner */}
      <section className={styles.supportBanner}>
        <div className={styles.supportBannerInner}>
          <div className={styles.supportContent}>
            <span className="badge badge-pink">Support the Creator</span>
            <h2 className={styles.supportTitle}>Hi, I'm Amaan Aly 👋</h2>
            <p className={styles.supportSub}>
              I built ResumeAI to help people land their dream jobs. If you found this tool helpful, consider buying me a coffee or sharing your suggestions!
            </p>
            <div className={styles.supportLinks}>
              <a href="mailto:khanamaan770@gmail.com" className="btn btn-secondary">
                ✉️ Email Suggestions
              </a>
              <a href="upi://pay?pa=khanamaan770@ptyes&pn=Amaan%20Aly&cu=INR" className="btn btn-primary">
                ☕ Donate via UPI
              </a>
              <div className={styles.upiId}>UPI ID: <strong>khanamaan770@ptyes</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className="gradient-text">ResumeAI</span>
          </div>
          <p className={styles.footerText}>© 2026 ResumeAI · Built by <strong>Amaan Aly</strong> · Available 24/7</p>
        </div>
      </footer>
    </main>
  );
}
