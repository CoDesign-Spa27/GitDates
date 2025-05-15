import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/card"
export const ActiveSummary =() =>{


  return (  
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-xl">Activity Summary</CardTitle>
      <CardDescription>Your network activity this week</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Profile Views</span>
          <span className="font-medium">24</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">New Connections</span>
          <span className="font-medium">7</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Messages</span>
          <span className="font-medium">13</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Pending Requests</span>
          <span className="font-medium">5</span>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}