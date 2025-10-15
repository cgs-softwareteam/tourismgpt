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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌍</span>
            <span className="text-xl font-bold">TourismSpot GPT</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium mb-4">
            🚀 Your AI-Powered Travel Companion
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Discover Your Next
            <span className="block text-primary mt-2">Dream Destination</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized travel recommendations, itineraries, and insider tips powered by advanced AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                Start Exploring
                <span className="ml-2">→</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need for Perfect Travel Planning
            </h2>
            <p className="text-xl text-muted-foreground">
              Powered by cutting-edge AI to make your travel dreams come true
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Personalized Recommendations</h3>
              <p className="text-muted-foreground">
                Get tailored suggestions for attractions, restaurants, and activities based on your unique preferences and travel style.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-2">Custom Itineraries</h3>
              <p className="text-muted-foreground">
                Create detailed day-by-day itineraries that maximize your time and help you experience the best of any destination.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2">Local Insights</h3>
              <p className="text-muted-foreground">
                Discover hidden gems and insider tips that only locals know about, making your trip truly authentic.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-xl font-bold mb-2">Accommodation Advice</h3>
              <p className="text-muted-foreground">
                Find the perfect place to stay with recommendations that match your budget and preferences.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold mb-2">Dining Recommendations</h3>
              <p className="text-muted-foreground">
                Explore the best restaurants, cafes, and local eateries that suit your taste and dietary requirements.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Answers</h3>
              <p className="text-muted-foreground">
                Get immediate responses to all your travel questions, from visa requirements to weather forecasts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Start planning your perfect trip in three simple steps
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Tell Us Your Destination</h3>
                <p className="text-lg text-muted-foreground">
                  Simply type in the city or destination you want to explore, or ask any travel-related question.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Share Your Preferences</h3>
                <p className="text-lg text-muted-foreground">
                  Let us know your interests, budget, travel dates, and any specific requirements for personalized recommendations.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Get Your Perfect Itinerary</h3>
                <p className="text-lg text-muted-foreground">
                  Receive detailed, personalized recommendations and itineraries that you can save, modify, and use for your trip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of travelers who trust TourismSpot GPT for their travel planning needs.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6 mt-4">
              Get Started Free
              <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌍</span>
              <span className="font-bold">TourismSpot GPT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TourismSpot GPT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
