import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <Tabs defaultValue="matches">
          <TabsList className="animate-fade-in w-full sm:w-auto">
            <TabsTrigger
              value="matches"
              className="flex-1 sm:flex-none"
              disabled>
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
            <TabsTrigger
              value="developers"
              className="flex-1 sm:flex-none"
              disabled>
              <Skeleton className="h-4 w-24" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <>
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-full">
              <Skeleton className="h-[280px] w-full rounded-lg" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-8 w-3/4" />
              </div>
            </div>
          ))}
        </>
      </div>
    </div>
  )
}
