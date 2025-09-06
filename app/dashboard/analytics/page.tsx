"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MoodTrendsChart } from "@/components/mood-trends-chart"
import { EmotionDistribution } from "@/components/emotion-distribution"
import { SentimentOverview } from "@/components/sentiment-overview"
import { WellnessInsights } from "@/components/wellness-insights"
import { MoodStats } from "@/components/mood-stats"
import { MoodCalendar } from "@/components/mood-calendar"
import { BarChart3, Sparkles } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="text-center glass-module p-8 rounded-3xl shimmer pulse-glow">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-4xl font-bold gradient-text float-animation">Your Wellness Analytics</h1>
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Discover patterns in your emotional journey and track your mental wellness progress.
              <br />
              <span className="text-primary font-medium">
                Every insight brings you closer to understanding yourself.
              </span>
            </p>
          </div>

          {/* Stats Overview */}
          <MoodStats />

          <MoodCalendar />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MoodTrendsChart />
            <EmotionDistribution />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SentimentOverview />
            </div>
            <div className="lg:col-span-1">
              <WellnessInsights />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
