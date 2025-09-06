"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp } from "lucide-react"

interface JournalEntry {
  id: number
  mood: number
  date: string
  moodScore?: number
}

interface ChartData {
  date: string
  userMood: number
  aiMood?: number
  day: string
}

export function MoodTrendsChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    const loadData = () => {
      const savedEntries: JournalEntry[] = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")

      // Get last 14 days of data
      const last14Days = savedEntries
        .slice(0, 14)
        .reverse()
        .map((entry) => ({
          date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          day: new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" }),
          userMood: entry.mood,
          aiMood: entry.moodScore,
        }))

      setChartData(last14Days)
    }

    loadData()
    window.addEventListener("entrySaved", loadData)
    return () => window.removeEventListener("entrySaved", loadData)
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="frosted-glass p-3 rounded-lg border border-border/50">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}/10
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="frosted-glass border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Mood Trends
        </CardTitle>
        <CardDescription>Track your mood patterns over the last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No data available. Start journaling to see your mood trends!</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[1, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={5.5} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" opacity={0.5} />

                <Line
                  type="monotone"
                  dataKey="userMood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  name="Your Rating"
                />

                {chartData.some((d) => d.aiMood) && (
                  <Line
                    type="monotone"
                    dataKey="aiMood"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 3 }}
                    name="AI Analysis"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
