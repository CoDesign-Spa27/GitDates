"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  createGithubProfile,
  getGithubProfile,
  updateGithubProfile,
} from "@/actions/user.profile.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Edit2, Github, MapPin, Code, ArrowUpRight, X 
} from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface GitDateProfileType {
  githubUsername: string;
  repositories: number;
  name: string;
  followers: number;
  following: number;
  mainLanguages: string[];
  contributions: number;
  bio: string;
  city: string;
  state: string;
  country: string;
  blog: string;
  image: string;
}

interface EditProfileForm {
  name: string;
  city: string;
  state: string;
  country: string;  
  bio: string;
  blog: string;
}

const GitDateProfile = () => {
  const [gitDetails, setGitDetails] = useState<any | null>(null);
  const [profile, setProfile] = useState<GitDateProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    reset,
    formState: { errors } 
  } = useForm<EditProfileForm>({
    defaultValues: {
      city: "",
      state: "",
      country: "",
      bio: "",
      blog: "",
      name: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/getUserStats");
        const data = await response.json();
        setGitDetails(data);

        const existingProfile: any = await getGithubProfile();
        setProfile(existingProfile);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (profile) {
      setValue("city", profile.city || "");
      setValue("state", profile.state || "");
      setValue("country", profile.country || "");
      setValue("bio", profile.bio || "");
      setValue("blog", profile.blog || "");
      setValue("name", profile.name || "");
    }
  }, [profile, setValue]);

  const handleCreateProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const newProfile: any = await createGithubProfile(gitDetails);
      setProfile(newProfile);
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: EditProfileForm) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile: any = await updateGithubProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    // Reset form to original profile values
    if (profile) {
      reset({
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        bio: profile.bio || "",
        blog: profile.blog || "",
        name: profile.name || "",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl rounded-2xl border-none shadow-xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl rounded-2xl border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <X className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
 
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl rounded-2xl border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gitdate to-gitdate-500 bg-clip-text text-transparent">
              Create Your GitDate Profile
            </CardTitle>
            <CardDescription className="text-lg">
              Get started by creating your profile in just one click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleCreateProfile} 
              variant="pressed"
              className="w-full h-12 text-lg"
            >
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - Profile Info */}
        <Card className="md:col-span-4 rounded-2xl border-none shadow-xl overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gitdate/30 to-transparent dark:from-gitdate/20" />
            <div className="relative p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-32 w-32 ring-4 ring-white/20">
                  <AvatarImage src={profile.image} alt={profile.githubUsername} />
                  <AvatarFallback className="bg-white/20 text-white text-3xl">
                    {profile.githubUsername.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h1 className="text-3xl font-bold text-gitdate mb-2">
                    {profile.name}
                  </h1>
                  <p className="text-neutral-950 dark:text-white/80 text-lg flex items-center justify-center gap-2">
                    @{profile.githubUsername}
                  </p>
                </div>

                <Button 
                 
                  size="icon" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute top-0 right-3 rounded-full backdrop-blur-sm transition-all duration-300"
                >
                  {isEditing ? (
                    <X className="h-5 w-5  text-white" />
                  ) : (
                    <Edit2 className="h-5 w-5  text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Repos", value: profile?.repositories },
                { label: "Followers", value: profile?.followers },
                { label: "Following", value: profile?.following }
              ].map(({label, value }) => (
                <div 
                  key={label} 
                  className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <p className="text-2xl font-bold text-gitdate">
                    {value}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Main Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.mainLanguages.map((lang) => (
                  <Badge 
                    key={lang} 
                    className="px-3 py-1 bg-gitdate/10 text-gitdate hover:bg-gitdate/20 transition-colors duration-300"
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Total Contributions</h3>
              <div className="flex items-center gap-2">
                <Github className="text-gitdate" />
                <Badge variant="secondary" className="bg-gitdate/10 text-gitdate px-3 py-1">
                  {profile.contributions}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column - Bio and Details */}
        <Card className="md:col-span-8 rounded-2xl border-none shadow-xl overflow-hidden">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="h-full">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Bio</Label>
                  <Input 
                    {...register("bio", { maxLength: { value: 250, message: "Bio must be 250 characters or less" } })}
                    placeholder="Tell us about yourself" 
                    className="border-b border-gitdate bg-transparent focus:border-gitdate-500"
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Location</Label>
                    <div className="space-y-3">
                      <Input 
                        {...register("city")}
                        placeholder="City" 
                        className="border-b border-gitdate bg-transparent focus:border-gitdate-500"
                      />
                      <Input 
                        {...register("state")}
                        placeholder="State/Province" 
                        className="border-b border-gitdate bg-transparent focus:border-gitdate-500"
                      />
                      <Input 
                        {...register("country")}
                        placeholder="Country" 
                        className="border-b border-gitdate bg-transparent focus:border-gitdate-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Blog/Website</Label>
                    <Input 
                      {...register("blog", { 
                        pattern: { 
                          value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 
                          message: "Invalid URL" 
                        } 
                      })}
                      placeholder="https://your-website.com" 
                      className="border-b border-gitdate bg-transparent focus:border-gitdate-500"
                    />
                    {errors.blog && (
                      <p className="text-red-500 text-sm">{errors.blog.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={cancelEditing}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="pressed"
                    className="px-6"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="h-full">
              <div className="p-6 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">About Me</h2>
                  <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed">
                    {profile?.bio || "No bio provided yet."}
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Location</h2>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <MapPin className="text-gitdate" size={20} />
                    <span>
                      {[
                        profile?.city,
                        profile?.state,
                        profile?.country
                      ].filter(Boolean).join(", ") || "No location provided"}
                    </span>
                  </div>
                </div>

                {profile?.blog && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Website</h2>
                    <Link 
                      href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                      target="_blank" 
                      className="flex items-center gap-2 text-gitdate hover:text-gitdate-500 transition-colors duration-300"
                    >
                      {profile.blog} <ArrowUpRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GitDateProfile;