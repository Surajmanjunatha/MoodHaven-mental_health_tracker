"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity } from "lucide-react"

interface JournalEntry {
  date: string
  sentiment: string
}

interface SentimentData {
  date: string
  positive: number
  negative: number
  neutral: number
}

export function SentimentOverview() {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])

  useEffect(() => {
    const loadData = () => {
      const savedEntries: JournalEntry[] = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")

      // Group by week and count sentiments
      const weeklyData: { [key: string]: { positive: number; negative: number; neutral: number } } = {}

      savedEntries.forEach((entry) => {
        const date = new Date(entry.date)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        const weekKey = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { positive: 0, negative: 0, neutral: 0 }
        }

        weeklyData[weekKey][entry.sentiment as keyof (typeof weeklyData)[string]]++
      })

      const data = Object.entries(weeklyData)
        .map(([date, sentiments]) => ({
          date,
          ...sentiments,
        }))
        .slice(-8) // Last 8 weeks

      setSentimentData(data)
    }

    loadData()
    window.addEventListener("entrySaved", loadData)
    return () => window.removeEventListener("entrySaved", loadData)
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="frosted-glass p-3 rounded-lg border border-border/50">
          <p className="font-medium mb-2">Week of {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} entries
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
          <Activity className="w-5 h-5 text-primary" />
          Sentiment Overview
        </CardTitle>
        <CardDescription>Weekly sentiment distribution over time</CardDescription>
      </CardHeader>
      <CardContent>
        {sentimentData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No sentiment data available yet. Keep journaling to see trends!</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                  name="Positive"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Neutral"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Negative"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
