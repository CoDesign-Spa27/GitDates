"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Edit3, 
  Github, 
  MapPin, 
  Code2, 
  ExternalLink, 
  X, 
  Check,
  Users,
  GitBranch,
  Star,
  Calendar,
  Globe
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  createGithubProfile,
  getGithubProfile,
  updateGithubProfile,
} from "@/actions/user.profile.action";
import { Card } from "@/components/ui/card";

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

  if (loading) {
    return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className=" rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className=" rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 h-40"></div>
              <div className=" rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 h-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen   flex items-center justify-center p-4">
        <div className=" rounded-3xl p-8 shadow-xl border border-slate-200/60 dark:border-slate-800 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Create Your Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Get started by creating your GitHub profile in just one click.
          </p>
          <Button
            onClick={handleCreateProfile}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200"
          >
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <Card className="rounded-lg p-8 shadow-sm mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 rounded-2xl">
                  <AvatarImage src={profile.image} alt={profile.name} className="rounded-2xl" />
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {profile.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-3">
                  @{profile.githubUsername}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {[profile.city, profile.state, profile.country]
                        .filter(Boolean)
                        .join(", ") || "Location not set"}
                    </span>
                  </div>
                  {profile.blog && (
                    <a
                      href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
          
          {!isEditing && (
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
              {profile.bio || "No bio provided yet."}
            </p>
          )}
        </Card>

        {isEditing ? (
          /* Edit Form */
          <div className="space-y-6">
            <Card className=" p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Edit Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Name
                  </Label>
                  <Input
                    {...register("name")}
         
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Bio
                  </Label>
                  <Input
                    {...register("bio", { maxLength: { value: 250, message: "Bio must be 250 characters or less" } })}
              
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      City
                    </Label>
                    <Input
                      {...register("city")}
    
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      State
                    </Label>
                    <Input
                      {...register("state")}
  
                      placeholder="California"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Country
                    </Label>
                    <Input
                      {...register("country")}
       
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Website
                  </Label>
                  <Input
                    {...register("blog", { 
                      pattern: { 
                        value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 
                        message: "Please enter a valid URL" 
                      } 
                    })}
     
                    placeholder="https://your-website.com"
                  />
                  {errors.blog && (
                    <p className="text-red-500 text-sm mt-1">{errors.blog.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Button
                  type="button"
 
                  onClick={cancelEditing}
 
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmit(onSubmit)()}
 
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Github className="w-5 h-5 text-gitdate" />
                GitHub Stats
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Repositories", value: profile.repositories, icon: GitBranch, color: "text-green-600" },
                  { label: "Followers", value: profile.followers, icon: Users, color: "text-blue-600" },
                  { label: "Following", value: profile.following, icon: Users, color: "text-purple-600" },
                  { label: "Contributions", value: profile.contributions, icon: Calendar, color: "text-orange-600" }
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-neutral-100 dark:bg-neutral-900 rounded-md p-4 text-center   transition-colors">
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {value.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Languages Card */}
            <Card className=" p-6 shadow-sm ">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-600" />
                Top Languages
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {profile.mainLanguages.map((lang, index) => (
                  <Badge
                    key={lang}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all hover:scale-105 ${
                      index === 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      index === 1 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                      index === 2 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
 
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitDateProfile;