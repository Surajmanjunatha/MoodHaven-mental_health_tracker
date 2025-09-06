"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Brain, Heart, TrendingUp, Shield, Sparkles, ArrowRight, Star, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced sentiment analysis understands your emotions and provides personalized insights",
    },
    {
      icon: TrendingUp,
      title: "Mood Trends",
      description: "Beautiful visualizations show your emotional patterns and progress over time",
    },
    {
      icon: Heart,
      title: "Wellness Guidance",
      description: "Receive personalized recommendations and early warning signals for better mental health",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your journal entries are secure and private, with end-to-end encryption",
    },
  ]

  const stats = [
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: Star, value: "4.9", label: "App Rating" },
    { icon: Clock, value: "24/7", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="frosted-glass gentle-fade sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mind Haven
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="gentle-fade hover:bg-accent/10">
                Sign In
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="frosted-glass gentle-fade hover-lift">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Mental Wellness
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            Guiding you to{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              mental balance
            </span>
          </h1>

          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Transform your daily journaling into powerful insights with AI-driven mood tracking, personalized wellness
            recommendations, and beautiful visualizations of your emotional journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="frosted-glass hover-lift gentle-fade group">
                Start Your Journey
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="frosted-glass hover-lift gentle-fade bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="frosted-glass hover-lift gentle-fade text-center border-0">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Everything you need for <span className="text-primary">mental wellness</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive tools to understand, track, and improve your mental health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="frosted-glass hover-lift gentle-fade border-0 cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      hoveredFeature === index
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="frosted-glass border-0 max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4 text-balance">Ready to start your wellness journey?</h3>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Join thousands of users who have transformed their mental health with Mind Haven.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="hover-lift gentle-fade group">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="frosted-glass border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Mind Haven</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Mind Haven. Guiding you to mental balance.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
