import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">VitalityTracker</h1>
          <Button onClick={() => navigate('/login')} variant="outline">
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Track Your Health, Simply</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          No marketing fluff. Just simple calorie intake, steps, and lifestyle tracking. Monitor your daily nutrition, fitness goals, and body measurements all in one place.
        </p>
        <Button onClick={() => navigate('/register')} size="lg" className="text-lg px-8">
          Start Tracking Free
        </Button>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What You Can Track</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <article className="bg-card border border-border rounded-lg p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-4">Daily Nutrition</h3>
            <p className="text-muted-foreground">
              Log your calorie intake and monitor your protein consumption. Track every meal and hit your nutrition goals.
            </p>
          </article>

          <article className="bg-card border border-border rounded-lg p-8">
            <div className="text-4xl mb-4">👟</div>
            <h3 className="text-xl font-bold mb-4">Step Counter</h3>
            <p className="text-muted-foreground">
              Monitor your daily steps and set personalized goals. Watch your progress and stay motivated to move more.
            </p>
          </article>

          <article className="bg-card border border-border rounded-lg p-8">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-4">Body Measurements</h3>
            <p className="text-muted-foreground">
              Track weight, chest, waist, shoulders, hips, and thighs. Visualize your progress with detailed charts.
            </p>
          </article>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 bg-card rounded-lg border border-border p-8">
        <h2 className="text-3xl font-bold mb-8">Why Choose VitalityTracker?</h2>
        <ul className="space-y-4 text-lg text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Simple and intuitive interface - no complicated features</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Real-time progress tracking with visual charts</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Completely free - no premium features or paywalls</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Privacy focused - your data is yours alone</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Multi-metric tracking for comprehensive health insights</span>
          </li>
        </ul>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Take Control?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands tracking their health with VitalityTracker
        </p>
        <Button onClick={() => navigate('/register')} size="lg" className="text-lg px-8">
          Create Your Account
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 VitalityTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
