import { useEffect } from 'react';
import { Check, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {motion} from 'motion/react'

export interface ProfileSetupStatus {
  isProfileCreated: boolean;
  isMatchPreferenceCreated: boolean;
}

export function ProfileSetupSuccess({
  isProfileCreated,
  isMatchPreferenceCreated
}: ProfileSetupStatus) {
  const allComplete = isProfileCreated && isMatchPreferenceCreated;
  const completedSteps = [isProfileCreated, isMatchPreferenceCreated].filter(Boolean).length;
  const totalSteps = 2;
  const progressPercentage = (completedSteps / totalSteps) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div 
          className={cn(
            "h-1.5 transition-all duration-700 ease-in-out",
            allComplete ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gitdate"
          )}
          style={{ width: `${progressPercentage}%` }}
        />
        
        <CardHeader className="text-center py-4">
          <motion.div 
            className="mx-auto flex items-center justify-center rounded-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {allComplete ? (
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-6 w-6 text-gitdate dark:text-gitdate" />
            )}
          </motion.div>
          
          <CardTitle className="text-xl font-bold mb-1">
            {allComplete ? "Profile Setup Complete!" : `Profile Setup (${completedSteps}/${totalSteps})`}
          </CardTitle>
          
          <p className="text-sm text-muted-foreground">
            {allComplete
              ? "Your GitDate profile is ready to find your perfect coding match."
              : "Complete the remaining steps to start matching with other developers."}
          </p>
        </CardHeader>

        <CardContent className="px-4 pb-3">
          <div className="space-y-3">
            {[
              {
                step: 1,
                label: "Create your GitDate profile",
                description: "Tell others about yourself and your coding interests",
                completed: isProfileCreated,
                href: "/dashboard/gitdate-profile"
              },
              {
                step: 2,
                label: "Set match preferences",
                description: "Define what you're looking for in a coding partner",
                completed: isMatchPreferenceCreated,
                href: "/dashboard/match-preferences"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className={cn(
                  "rounded-lg p-3 transition-all duration-300",
                  item.completed 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50" 
                    : "bg-muted border border-muted-foreground/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
                      item.completed 
                        ? "bg-green-500 text-white" 
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {item.completed ? <Check className="h-4 w-4" /> : item.step}
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-sm font-medium",
                        item.completed ? "text-green-700 dark:text-green-400" : ""
                      )}>
                        {item.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  
                  {!item.completed && (
                    <Button variant="link" size="sm" className="shrink-0" asChild>
                      <a href={item.href} className='text-red-600'>Complete</a>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-3 flex flex-col gap-2">
          {allComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <Button asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md">
                <a href="/dashboard/gitdate-profile">
                  View Your Profile
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-1">
                Your profile is now visible to potential matches
              </p>
            </motion.div>
          ) : (
            <div className="w-full">
              <p className="text-xs text-center text-muted-foreground mb-2">
                Complete all steps to activate your profile
              </p>
              <Button disabled className="w-full opacity-70">
                Profile Incomplete
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}