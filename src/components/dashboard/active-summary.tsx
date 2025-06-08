'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Activity, Eye, Users, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { getActivitySummary } from "@/actions/activity.action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface ActivitySummary {
  profileViews: number
  newConnections: number
  pendingRequests: number
}

const chartConfig = {
  count: {
    label: "Count",
  },
  profile: {
    label: "Profile Views",
    color: "hsl(var(--chart-1))",
  },
  connections: {
    label: "New Connections",
    color: "hsl(var(--chart-2))",
  },
 
  pending: {
    label: "Pending Requests",
    color: "hsl(var(--chart-4))",
  },
}

export const ActiveSummary = ({activityData, loading}:{activityData:ActivitySummary, loading:boolean}) => { 
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Activity Summary</h1>
          </div>
          <p className="text-muted-foreground">Your network activity this week</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-6">
                <Skeleton className="h-5 w-5 mx-auto mb-2" />
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const chartData = [
    {
      activity: "Profile Views",
      count: activityData?.profileViews || 0,
      fill: "var(--color-profile)",
      icon: Eye,
    },
    {
      activity: "New Connections",
      count: activityData?.newConnections || 0,
      fill: "var(--color-connections)",
      icon: Users,
    },
    {
      activity: "Pending Requests",
      count: activityData?.pendingRequests || 0,
      fill: "var(--color-pending)",
      icon: Clock,
    },
  ]

  const totalActivity = chartData.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
   
 
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {chartData.map((item, index) => {
          const IconComponent = item.icon
          return (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{item.count}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.activity}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
 
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weekly Activity Breakdown
          </CardTitle>
          <CardDescription>
            Total activities: {totalActivity} •{" "}
            {totalActivity > 0 ? "Keep up the great work!" : "Time to get more active!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="max-h-[100px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="activity"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  if (value === "Pending Requests") return "Pending"
                  if (value === "New Connections") return "Connections"
                  if (value === "Profile Views") return "Views"
                  return value
                }}
                className="text-xs"
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, "dataMax + 1"]} />
              <ChartTooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="count"
                fill="var(--color-profile)"
                radius={[4, 4, 0, 0]}
                className="transition-all duration-300 hover:opacity-80"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

  
    </div>
  )
}