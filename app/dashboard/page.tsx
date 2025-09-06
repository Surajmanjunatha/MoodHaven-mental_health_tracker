"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen, TrendingUp, Quote, Sparkles, Heart } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [todaysMood, setTodaysMood] = useState<number | null>(null)
  const [quote, setQuote] = useState("")
  const [showGreeting, setShowGreeting] = useState(false)
  const [userName, setUserName] = useState("")

  const motivationalQuotes = [
    "You don't have to control your thoughts. You just have to stop letting them control you. — Dan Millman",
    "The greatest revolution of our generation is the discovery that human beings can alter their lives by altering their attitudes. — William James",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. — Ralph Waldo Emerson",
    "You are not your thoughts, you are the observer of your thoughts. — Eckhart Tolle",
    "The only way out is through. — Robert Frost",
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "Progress, not perfection. Every small step counts on your wellness journey.",
  ]

  useEffect(() => {
    const userData = localStorage.getItem("mind-haven-user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.name)

      // Show greeting animation after a short delay
      setTimeout(() => setShowGreeting(true), 500)
    }

    // Get today's mood from localStorage
    const today = new Date().toDateString()
    const entries = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")
    const todayEntry = entries.find((entry: any) => new Date(entry.date).toDateString() === today)
    if (todayEntry) {
      setTodaysMood(todayEntry.mood)
    }

    const quoteIndex = new Date().getDate() % motivationalQuotes.length
    setQuote(motivationalQuotes[quoteIndex])
  }, [])

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😟", "😕", "😐", "🙂", "😊", "😄", "😁", "🤩", "🥳"]
    return emojis[mood - 1] || "😐"
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div
            className={`text-center glass-module p-6 rounded-2xl shimmer pulse-glow transition-all duration-1000 ${
              showGreeting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              <h1 className="text-3xl font-bold gradient-text float-animation">
                {getTimeBasedGreeting()}, {userName}!
              </h1>
              <Heart className="w-6 h-6 text-destructive animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Welcome to your personal sanctuary for mental wellness and growth.
              <br />
              <span className="text-primary font-medium">Every moment is a new beginning.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-module hover-lift gentle-fade shimmer pulse-glow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-6 h-6 text-primary animate-pulse" />
                  <span className="gradient-text">Today's Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysMood ? (
                  <div className="text-center">
                    <div className="text-6xl mb-3 float-animation">{getMoodEmoji(todaysMood)}</div>
                    <p className="text-3xl font-bold gradient-text mb-2">{todaysMood}/10</p>
                    <p className="text-sm text-muted-foreground">You're doing great!</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-3 float-animation">🤔</div>
                    <p className="text-sm text-muted-foreground mb-4">How are you feeling today?</p>
                    <Link href="/dashboard/journal">
                      <Button
                        size="lg"
                        className="glass-module hover-lift pulse-glow bg-gradient-to-r from-primary to-accent text-white"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Log Mood
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-module hover-lift gentle-fade md:col-span-2 shimmer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Quote className="w-6 h-6 text-accent animate-pulse" />
                  <span className="gradient-text">Daily Inspiration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-xl italic text-center leading-relaxed bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  "{quote}"
                </blockquote>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-module hover-lift gentle-fade shimmer pulse-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary animate-pulse" />
                  <span className="gradient-text">Quick Journal Entry</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Share your thoughts and let AI help you understand your emotions with personalized insights.
                </p>
                <Link href="/dashboard/journal">
                  <Button className="w-full glass-module hover-lift bg-gradient-to-r from-primary via-accent to-emerald-400 text-white text-lg py-6">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Writing
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-module hover-lift gentle-fade shimmer pulse-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-accent animate-pulse" />
                  <span className="gradient-text">View Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Track your mood trends, emotional patterns, and wellness journey over time.
                </p>
                <Link href="/dashboard/analytics">
                  <Button
                    variant="outline"
                    className="w-full glass-module hover-lift bg-gradient-to-r from-accent/20 to-primary/20 border-primary/30 text-primary text-lg py-6"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
