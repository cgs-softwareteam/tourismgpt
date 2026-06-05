import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function LandingPage() {
  const session = await auth();

  // If user is already logged in, redirect to chat
  if (session) {
    redirect("/chat");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-md bg-white/50 dark:bg-slate-900/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-3xl bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">🌍</div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TourismSpot GPT</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/30">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4 border border-primary/30 shadow-lg">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">🚀 Your AI-Powered Travel Companion</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Discover Your Next
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-2 animate-gradient">Dream Destination</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Get personalized travel recommendations, itineraries, and insider tips powered by advanced AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105">
                Try it Free
                <span className="ml-2">→</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto border-2 border-primary/30 hover:bg-primary/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                Start Exploring
              </Button>
            </Link>
          </div>
          <p className="text-sm text-foreground/50">
            No account needed — try 5 free messages as a guest.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Everything You Need for Perfect Travel Planning
            </h2>
            <p className="text-xl text-foreground/60">
              Powered by cutting-edge AI to make your travel dreams come true
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-primary/20 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-blue-900/20 group">
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">🎯</div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Personalized Recommendations</h3>
              <p className="text-foreground/60">
                Get tailored suggestions for attractions, restaurants, and activities based on your unique preferences and travel style.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-secondary/20 bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-800 dark:to-purple-900/20 group">
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">🗺️</div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Custom Itineraries</h3>
              <p className="text-foreground/60">
                Create detailed day-by-day itineraries that maximize your time and help you experience the best of any destination.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-accent/20 bg-gradient-to-br from-white to-teal-50/50 dark:from-slate-800 dark:to-teal-900/20 group">
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">💡</div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Local Insights</h3>
              <p className="text-foreground/60">
                Discover hidden gems and insider tips that only locals know about, making your trip truly authentic.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-chart-4/20 bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-800 dark:to-orange-900/20 group">
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">🏨</div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-chart-4 to-chart-5 bg-clip-text text-transparent">Accommodation Advice</h3>
              <p className="text-foreground/60">
                Find the perfect place to stay with recommendations that match your budget and preferences.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-chart-5/20 bg-gradient-to-br from-white to-pink-50/50 dark:from-slate-800 dark:to-pink-900/20 group">
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">🍽️</div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-chart-5 to-primary bg-clip-text text-transparent">Dining Recommendations</h3>
              <p className="text-foreground/60">
                Explore the best restaurants, cafes, and local eateries that suit your taste and dietary requirements.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-primary/20 bg-gradient-to-br from-white to-indigo-50/50 dark:from-slate-800 dark:to-indigo-900/20 group">
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">⚡</div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Instant Answers</h3>
              <p className="text-foreground/60">
                Get immediate responses to all your travel questions, from visa requirements to weather forecasts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              How It Works
            </h2>
            <p className="text-xl text-foreground/60">
              Start planning your perfect trip in three simple steps
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-6 group">
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                1
              </div>
              <div className="flex-1 text-center md:text-left p-6 rounded-2xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 border border-primary/20 transition-all duration-300 group-hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tell Us Your Destination</h3>
                <p className="text-lg text-foreground/60">
                  Simply type in the city or destination you want to explore, or ask any travel-related question.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 group">
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-secondary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                2
              </div>
              <div className="flex-1 text-center md:text-left p-6 rounded-2xl bg-gradient-to-r from-purple-50/50 to-teal-50/50 dark:from-purple-900/20 dark:to-teal-900/20 border border-secondary/20 transition-all duration-300 group-hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Share Your Preferences</h3>
                <p className="text-lg text-foreground/60">
                  Let us know your interests, budget, travel dates, and any specific requirements for personalized recommendations.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 group">
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-accent/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                3
              </div>
              <div className="flex-1 text-center md:text-left p-6 rounded-2xl bg-gradient-to-r from-teal-50/50 to-blue-50/50 dark:from-teal-900/20 dark:to-blue-900/20 border border-accent/20 transition-all duration-300 group-hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Get Your Perfect Itinerary</h3>
                <p className="text-lg text-foreground/60">
                  Receive detailed, personalized recommendations and itineraries that you can save, modify, and use for your trip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/90 to-accent/90 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of travelers who trust TourismSpot GPT for their travel planning needs.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 mt-4 bg-white text-primary hover:bg-white/90 shadow-2xl transition-all duration-300 hover:scale-105">
                Get Started Free
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 mt-20 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-teal-50/50 dark:from-slate-900/50 dark:via-purple-900/20 dark:to-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl bg-gradient-to-br from-primary to-secondary p-1.5 rounded-lg">🌍</div>
              <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TourismSpot GPT</span>
            </div>
            <p className="text-sm text-foreground/60">
              © 2025 TourismSpot GPT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
