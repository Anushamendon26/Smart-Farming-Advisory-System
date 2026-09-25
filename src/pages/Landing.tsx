import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  CloudSun,
  Droplets,
  FlaskConical,
  Leaf,
  MessageSquare,
  Sprout,
} from 'lucide-react'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const features = [
  {
    icon: <Sprout size={28} />,
    emoji: '🌱',
    title: 'Crop Advisory',
    text: 'Get crop recommendations matched to your soil, weather and season.',
  },
  {
    icon: <CloudSun size={28} />,
    emoji: '🌦️',
    title: 'Weather Intelligence',
    text: 'Seven-day forecasts translated into simple farming actions.',
  },
  {
    icon: <FlaskConical size={28} />,
    emoji: '🧪',
    title: 'Soil Analysis',
    text: 'Understand your soil nutrients and what to improve first.',
  },
  {
    icon: <Leaf size={28} />,
    emoji: '🐛',
    title: 'Disease Detection',
    text: 'Upload a leaf photo and identify possible plant diseases early.',
  },
  {
    icon: <Droplets size={28} />,
    emoji: '💧',
    title: 'Irrigation Guidance',
    text: 'Know exactly when and how much to water — saving water and cost.',
  },
  {
    icon: <MessageSquare size={28} />,
    emoji: '🤖',
    title: 'AI Farming Assistant',
    text: 'Ask farming questions in your own language and get clear answers.',
  },
]

const steps = [
  { n: '1', title: 'Enter Farm Details', text: 'Tell us your location, soil type and current crop. It takes two minutes.' },
  { n: '2', title: 'Analyze Farm Conditions', text: 'We combine weather, soil and crop data to understand your field.' },
  { n: '3', title: 'Get Personalized Advice', text: 'Receive simple, actionable recommendations — each one explains why it is suggested.' },
  { n: '4', title: 'Take Action', text: 'Apply the advice in the field — water, fertilize, spray or sell at the right time.' },
]

const accessibility = [
  { emoji: '🎤', title: 'Voice First', text: 'Ask questions by voice and listen to answers — no typing needed.' },
  { emoji: '🗣️', title: 'Regional Languages', text: 'Use the app in English, हिंदी and मराठी — switch anytime.' },
  { emoji: '📱', title: 'Works on Mobile', text: 'Designed mobile-first for the phone in your pocket, not a desktop.' },
  { emoji: '📶', title: 'Low-Connectivity Friendly', text: 'Clear offline indicators and saved data when the network is weak.' },
]

const stats = [
  { title: 'AI-powered insights', text: 'Recommendations tailored to your farm conditions, not generic advice.' },
  { title: 'Weather-aware recommendations', text: 'Every advisory considers the forecast before suggesting field work.' },
  { title: 'Crop health monitoring', text: 'Track crop health, soil moisture and disease risk in one place.' },
]

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <div className="flex items-center gap-2 text-2xl font-extrabold text-primary">
          <span aria-hidden>🌾</span> SmartFarm
        </div>
        <Button size="sm" onClick={() => navigate('/login')}>
          Login
        </Button>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:px-6 md:pt-12">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            Smart Decisions. <span className="text-primary">Better Farming.</span>
          </h1>
          <p className="mt-4 text-lg text-muted md:text-xl">
            AI-powered farming advice for crops, soil, weather, irrigation and plant health.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate('/login')}>
              Get Started <ArrowRight size={20} aria-hidden />
            </Button>
            <a href="#features">
              <Button size="lg" variant="outline">
                Explore Features
              </Button>
            </a>
          </div>
        </div>

        {/* Hero visual — farmer with smartphone in a green field (pure CSS illustration) */}
        <div
          className="relative overflow-hidden rounded-xl2 bg-gradient-to-b from-[#DCF0DC] to-primary-light shadow-card"
          role="img"
          aria-label="Illustration of a farmer using a smartphone in a green agricultural field"
        >
          <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-accent opacity-90" aria-hidden />
          {/* rolling fields */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-secondary/40" style={{ borderRadius: '50% 50% 0 0 / 22% 22% 0 0' }} aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-[38%] bg-primary/70" style={{ borderRadius: '46% 54% 0 0 / 30% 24% 0 0' }} aria-hidden />
          {/* crop rows */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-around px-6 text-2xl" aria-hidden>
            <span>🌿</span><span>🌿</span><span>🌱</span><span>🌿</span><span>🌱</span><span>🌿</span>
          </div>
          {/* farmer + phone */}
          <div className="relative z-10 mx-auto flex w-fit items-end gap-3 px-6 pb-14 pt-20">
            <div className="text-7xl md:text-8xl" aria-hidden>👨‍🌾</div>
            <div className="rounded-xl bg-white p-2 text-4xl shadow-card" aria-hidden>📱</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-center text-3xl font-extrabold text-ink">Everything your farm needs, in one app</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-lg text-muted">
          Simple tools built for real field conditions — no technical knowledge needed.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} hoverable>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light text-primary">
                <span className="text-2xl" aria-hidden>{f.emoji}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-base text-muted">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-center text-3xl font-extrabold text-ink">How It Works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-xl2 border border-gray-100 bg-background p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-base text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for every farmer — accessibility */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6" aria-labelledby="a11y">
        <h2 id="a11y" className="text-center text-3xl font-extrabold text-ink">Built for Every Farmer</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-lg text-muted">
          Simple, accessible and available in your language.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {accessibility.map((a) => (
            <Card key={a.title} className="text-center" hoverable>
              <span className="text-4xl" aria-hidden>{a.emoji}</span>
              <h3 className="mt-3 text-xl font-bold text-ink">{a.title}</h3>
              <p className="mt-1.5 text-base text-muted">{a.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.title} className="text-center">
              <BarChart3 className="mx-auto text-accent" size={30} aria-hidden />
              <h3 className="mt-3 text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-base text-muted">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-xl2 bg-primary px-6 py-12 text-center text-white md:py-16">
          <h2 className="text-2xl font-extrabold md:text-4xl">
            Start making smarter farming decisions today.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">
            Join farmers using data — not guesswork — to grow more with less.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="accent" onClick={() => navigate('/signup')}>
              Create Free Account <ArrowRight size={20} aria-hidden />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate('/login')}>
              I Already Have an Account
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-6 text-center text-sm text-muted">
        🌾 SmartFarm — Smart Farming Advisory System
      </footer>
    </div>
  )
}
