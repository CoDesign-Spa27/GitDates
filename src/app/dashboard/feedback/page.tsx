'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  submitFeedback,
  getUserFeedback,
  FeedbackFormData,
} from '@/actions/feedback.action'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import {
  Bug,
  MessageSquare,
  Plus,
  ThumbsUp,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const feedbackSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  type: z.enum(['BUG', 'FEATURE_REQUEST', 'IMPROVEMENT', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
})

interface Feedback {
  id: string
  title: string
  description: string
  type: 'BUG' | 'FEATURE_REQUEST' | 'IMPROVEMENT' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  createdAt: string
}

const feedbackTypeIcons = {
  BUG: Bug,
  FEATURE_REQUEST: Plus,
  IMPROVEMENT: ThumbsUp,
  OTHER: MessageSquare,
}

const feedbackTypeLabels = {
  BUG: 'Bug Report',
  FEATURE_REQUEST: 'Feature Request',
  IMPROVEMENT: 'Improvement',
  OTHER: 'Other',
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  MEDIUM:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const statusIcons = {
  OPEN: AlertCircle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle2,
  CLOSED: CheckCircle2,
}

const statusColors = {
  OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  IN_PROGRESS:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userFeedback, setUserFeedback] = useState<Feedback[]>([])
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true)

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'BUG',
      priority: 'MEDIUM',
    },
  })

  const fetchUserFeedback = async () => {
    setIsLoadingFeedback(true)
    try {
      const result = await getUserFeedback()
      if (result) {
        setUserFeedback(result.additional.map(feedback => ({
          ...feedback,
          createdAt: feedback.createdAt.toString(),
          updatedAt: feedback.updatedAt.toString()
        })))
      } else {
        toast({
          title: 'Error', 
          description: 'Failed to fetch your feedback history',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch your feedback history',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingFeedback(false)
    }
  }

  useEffect(() => {
    fetchUserFeedback()
  }, [])

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)
    try {
      const result = await submitFeedback(data)
      if (result.status) {
        toast({
          title: 'Success',
          description: 'Your feedback has been submitted successfully!',
          variant: 'success',
        })
        form.reset()
        fetchUserFeedback()
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to submit feedback',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Feedback & Support</h1>
        <p className="text-muted-foreground">
          Help us improve GitDates by reporting bugs, suggesting features, or
          providing general feedback.
        </p>
      </div>

      <Tabs defaultValue="submit" className="w-full">
        <TabsList className="max-w-md w-full grid grid-cols-2">
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="history">My Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Submit New Feedback</CardTitle>
              <CardDescription>
                Tell us about bugs, request new features, or suggest
                improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select feedback type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BUG">
                                <div className="flex items-center gap-2">
                                  <Bug className="h-4 w-4" />
                                  Bug Report
                                </div>
                              </SelectItem>
                              <SelectItem value="FEATURE_REQUEST">
                                <div className="flex items-center gap-2">
                                  <Plus className="h-4 w-4" />
                                  Feature Request
                                </div>
                              </SelectItem>
                              <SelectItem value="IMPROVEMENT">
                                <div className="flex items-center gap-2">
                                  <ThumbsUp className="h-4 w-4" />
                                  Improvement
                                </div>
                              </SelectItem>
                              <SelectItem value="OTHER">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  Other
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="CRITICAL">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Brief description of the issue or request"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a clear and concise title (max 100 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide detailed information about the issue, including steps to reproduce (for bugs) or detailed explanation (for features)"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description of the issue or request (max 1000
                          characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Your Feedback History</CardTitle>
              <CardDescription>
                Track the status of your submitted feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFeedback ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : userFeedback.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No feedback submitted yet</p>
                  <p className="text-sm">
                    Your submitted feedback will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 grid sm:grid-cols-2">
                  {userFeedback.map((feedback) => {
                    const TypeIcon = feedbackTypeIcons[feedback.type]
                    const StatusIcon = statusIcons[feedback.status]
                    return (
                      <div
                        key={feedback.id}
                        className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">{feedback.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={priorityColors[feedback.priority]}>
                              {feedback.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feedback.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="outline">
                            {feedbackTypeLabels[feedback.type]}
                          </Badge>
                          <span>
                            {formatDistanceToNow(new Date(feedback.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
