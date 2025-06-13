'use client'
import { Settings2Icon, UserCircle } from 'lucide-react'
import {motion} from 'motion/react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { useProfileSetupStatus } from './hooks/useProfileSetupStatus';
import { Skeleton } from './ui/skeleton';

export const SetupReminder = () =>{
     const router = useRouter();
      const {setupDone, isLoading: setupLoading} = useProfileSetupStatus();
 if (setupLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }
    return  <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <div className="bg-muted/50 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <UserCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Complete Your Profile Setup</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            To start connecting with other developers, you'll need to complete your profile setup first. 
            This helps us find the best matches for you.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => router.push("/dashboard/profile")}
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <Settings2Icon className="h-5 w-5" />
              Complete Profile Setup
            </Button>
            <p className="text-sm text-muted-foreground">
              This will only take a few minutes
            </p>
          </div>
        </motion.div>
      </div>
}