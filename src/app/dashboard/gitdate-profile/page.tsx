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
        <Card className="w-full max-w-4xl rounded-2xl border-none">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
 
  if (!profile ) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-xl rounded-2xl border-none">
          <CardHeader>
            <CardTitle>Create Your Git Dates Profile</CardTitle>
            <CardDescription>
              Get started by creating your profile on just one click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateProfile} variant={'outline'}>
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border-none">
        <div className="absolute top-1/2 right-4 z-10 flex gap-2">
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/50 transition-all"
            >
              <Edit2 className="h-5 w-5 text-gitdate font-bold" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={cancelEditing}
              className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/50 transition-all"
            >
              <X className="h-5 w-5 text-gitdate" />
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-zinc-800">
            <div className="p-8">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.image} alt={profile.githubUsername} />
                  <AvatarFallback className="bg-white/20 text-white">
                    {profile.githubUsername.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <Input 
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter your name" 
                    className="border-b border-gitdate bg-transparent focus:border-gitdate-500"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  <p className="text-black dark:text-white/80 text-lg flex items-center gap-2 mt-2">
                    <Github className="h-5 w-5" />
                    @{profile.githubUsername}
                  </p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-8 space-y-6">
              <div>
                <Label className="text-lg font-semibold">Bio</Label>
                <Input 
                  {...register("bio", { maxLength: { value: 250, message: "Bio must be 250 characters or less" } })}
                  placeholder="Enter your bio" 
                  className="border-b border-gitdate bg-transparent focus:border-gitdate-500"

                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input 
                    {...register("city")}
                    placeholder="Enter your location" 
                    className="border-b border-gitdate bg-transparent focus:border-gitdate-500"

                  />
                  <Input 
                    {...register("state")}
                    placeholder="Enter your state" 
                    className="border-b border-gitdate bg-transparent focus:border-gitdate-500"

                  />
                  <Input 
                    {...register("country")}
                    placeholder="Enter your country" 
                    className="border-b border-gitdate bg-transparent focus:border-gitdate-500"

                  />
                </div>
                
                <div>
                  <Label>Blog/Website</Label>
                  <Input 
                    {...register("blog", { 
                      pattern: { 
                        value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 
                        message: "Invalid URL" 
                      } 
                    })}
                    placeholder="Enter your website URL" 
                    className="border-b border-gitdate bg-transparent focus:border-gitdate-500"

                  />
                  {errors.blog && <p className="text-red-500 text-sm mt-1">{errors.blog.message}</p>}
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="outline"
                className="w-full bg-gitdate hover:bg-gitdate-500 transition-colors"
              >
                Save Changes
              </Button>
            </CardContent>
          </form>
        ) : (
          <>
            <div className="text-white p-8">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 ring ring-white">
                  <AvatarImage src={profile.image} alt={profile.githubUsername} />
                  <AvatarFallback className="bg-white/20 text-white">
                    {profile.githubUsername.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h1 className="text-4xl text-gitdate  font-bold mb-2 drop-shadow-md">
                    {profile.name}
                  </h1>
                  <p className="dark:text-white text-black text-lg flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    @{profile.githubUsername}
                  </p>
                </div>
              </div>
            </div>
            
            <CardContent className="bg-white dark:bg-zinc-800 p-8 space-y-8">
            <div className="grid grid-cols-3 gap-6">
            {[
              {   label: "Repositories", value: profile?.repositories },
              { label: "Followers", value: profile?.followers },
              { label: "Following", value: profile?.following }
            ].map(({label, value }) => (
              <div 
                key={label} 
                className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-5 text-center hover:shadow-lg transition-all"
              >
            
                <p className="text-3xl font-bold text-gitdate dark:text-gitdate">
                  {value}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code className="text-gitdate" /> Main Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile?.mainLanguages.map((lang) => (
                <Badge 
                  key={lang} 
                  className="px-3 py-1 bg-gitdate/10 text-gitdate hover:bg-gitdate/20 transition-colors"
                >
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl">
            <p className="text-zinc-600 dark:text-zinc-300 italic">
              "{profile?.bio}"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-gitdate" size={20} />
                <span>{profile?.city}</span>
                <span>{profile?.state}</span>
                <span>{profile?.country}</span>
              </div>
              
              {profile?.blog && (
                <Link 
                  href={profile.blog} 
                  target="_blank" 
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  Website <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </div>
            </CardContent>
          </>
        )}
        
        <CardFooter className="bg-zinc-100 dark:bg-zinc-900 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Github className="text-gitdate" />
            <span>Total Contributions</span>
            <Badge variant="secondary" className="bg-gitdate/10 text-gitdate">
              {profile.contributions}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GitDateProfile;