import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className='flex items-start justify-center gap-4 py-4'>
      <div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
   
          <div className="md:col-span-1 h-full">
            <div className="p-6 overflow-hidden bg-white rounded-2xl shadow-md dark:bg-neutral-900">
              <div className="flex flex-col items-center">
 
                <div className="relative mb-4">
                  <Skeleton className="w-32 h-32 rounded-full" />
                </div>
                
     
                <Skeleton className="h-8 w-32 mb-1" />
                
      
                <div className="flex items-center mb-4 space-x-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
 
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-4" />
    
                <div className="flex items-center mb-4 space-x-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
     
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="text-center">
                    <Skeleton className="h-6 w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-6 w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-6 w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          <div className="md:col-span-2 space-y-6">
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-white rounded-2xl shadow-md dark:bg-neutral-900">
                  <div className="flex items-center space-x-3 mb-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </div>
              ))}
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-md dark:bg-neutral-900">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md dark:bg-neutral-900">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
