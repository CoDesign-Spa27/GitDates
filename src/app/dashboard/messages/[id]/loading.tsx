import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header skeleton */}
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="mb-1 h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Chat container skeleton */}
        <div className="flex h-[calc(100vh-16rem)] flex-col overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Skeleton messages - alternating between left and right */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[70%] ${i % 2 === 0 ? 'bg-muted' : 'bg-primary/10'} rounded-lg p-3`}>
                    <Skeleton
                      className={`h-4 w-${Math.floor(Math.random() * 40) + 20} mb-1`}
                    />
                    <Skeleton
                      className={`h-4 w-${Math.floor(Math.random() * 30) + 15}`}
                    />
                  </div>
                </div>
              ))}

              {/* Typing indicator skeleton */}
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input area skeleton */}
          <div className="flex gap-2 border-t border-border p-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
