"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Heart, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JournalEntry {
  emotions: string[]
}

interface EmotionData {
  name: string
  value: number
  color: string
}

const emotionColors = [
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
]

export function EmotionDistribution() {
  const [emotionData, setEmotionData] = useState<EmotionData[]>([])
  const [viewType, setViewType] = useState<"pie" | "bar">("pie")

  useEffect(() => {
    const loadData = () => {
      const savedEntries: JournalEntry[] = JSON.parse(localStorage.getItem("mind-haven-entries") || "[]")

      // Count emotion frequencies
      const emotionCounts: { [key: string]: number } = {}

      savedEntries.forEach((entry) => {
        entry.emotions?.forEach((emotion) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
        })
      })

      // Convert to chart data
      const data = Object.entries(emotionCounts)
        .map(([emotion, count], index) => ({
          name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
          value: count,
          color: emotionColors[index % emotionColors.length],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8) // Top 8 emotions

      setEmotionData(data)
    }

    loadData()
    window.addEventListener("entrySaved", loadData)
    return () => window.removeEventListener("entrySaved", loadData)
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="frosted-glass p-3 rounded-lg border border-border/50">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} occurrence{data.value !== 1 ? "s" : ""}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="frosted-glass border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Emotion Distribution
            </CardTitle>
            <CardDescription>Most frequent emotions in your journal entries</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewType === "pie" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("pie")}
              className="frosted-glass"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant={viewType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("bar")}
              className="frosted-glass"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {emotionData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No emotion data available yet. Keep journaling to see patterns!</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {viewType === "pie" ? (
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : (
                <BarChart data={emotionData}>
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
