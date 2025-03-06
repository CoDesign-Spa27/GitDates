"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { UserData } from "../page";
import { useForm } from "react-hook-form";
import { getUserProfile, updateUserProfile } from "@/actions/user.profile.action";
import { Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfileFormData {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  gender?: string;
  image?: FileList;
}

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        setImagePreview(profile?.image || null);

        setValue("name", profile?.name || "");
        setValue("gender", profile?.gender || "");
        setValue("city", profile?.city || "");
        setValue("state", profile?.state || "");
        setValue("country", profile?.country
        || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setValue]);

console.log("User Profile:", userProfile);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log("Form data:", data);
      
      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error("Name is required");
      }

      // Update profile
      const updatedProfile = await updateUserProfile(data);
      
      if (!updatedProfile) {
        throw new Error("Failed to update profile");
      }

      // Update local state with server response
      setUserProfile(updatedProfile);

      toast({
        title: "Profile updated successfully",
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "Please try again",
     
      });
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-primary/5 p-6 flex flex-col items-center justify-center">
            <div className="relative">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage
                  src={imagePreview || "/placeholder.svg?height=128&width=128"}
                  // alt={userProfile}
                />
                <AvatarFallback>
                  {userProfile?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="image-upload"
                className="absolute bottom-4 right-0 cursor-pointer"
              >
                <div className="rounded-full bg-neutral-700 p-2 text-white hover:bg-neutral-500/90">
                 <Camera className="w-6 h-6" />
                </div>
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                {...register("image", {
                  onChange: handleImageChange
                })}
              />
            </div>
          
            <CardTitle className="text-2xl font-bold mb-2">
              {userProfile?.name}
            </CardTitle>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
          <div className="md:w-2/3 p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-3xl font-bold">
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={userProfile?.username || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userProfile?.email || ''} disabled />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register("state")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" {...register("country")} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      onValueChange={(value) => setValue("gender", value)}
                      value={userProfile?.gender || ""}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-0 pb-0">
                <Button  type="submit" className="w-full">
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
