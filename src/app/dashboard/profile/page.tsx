// "use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useState, useEffect } from "react";
// import { signOut, useSession } from "next-auth/react";
// import { UserData } from "../page";
// import { useForm } from "react-hook-form";
// import { getUserProfile, updateUserProfile } from "@/actions/user.profile.action";
// import { Camera } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import useSWRMutation from "swr/mutation";
// import { updateAvatarMutation } from "../../../fetchers/mutations";
// import { uploadImage } from "@/lib/upload-image";

// interface ProfileFormData {
//   name?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   gender?: string;
//   image?: FileList;
// }

// const ProfilePage = () => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<ProfileFormData>();

//   const [userProfile, setUserProfile] = useState<any | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const { data: session } = useSession();
//   const email = session?.user?.email;
//   const {trigger:updateAvatar} = useSWRMutation(
//    email ? ['updateAvatar', email] : null,
//    (_key,{arg}:{arg:{email:string, avatar:string}}) => updateAvatarMutation(arg.email,arg.avatar)
//   )


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const profile = await getUserProfile();
//         if (!profile) {
//           throw new Error("Failed to fetch user profile");
//         }
//         setUserProfile(profile);
//         setValue("name", profile?.name || "");
//         setImagePreview(profile?.image || null);
//         setValue("gender", profile?.gender || "");
//         setValue("city", profile?.city || "");
//         setValue("state", profile?.state || "");
//         setValue("country", profile?.country
//         || "");
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [setValue]);
 
//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     try{
//       const file = e.target.files?.[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setImagePreview(reader.result as string);
//         };
//         reader.readAsDataURL(file);
//       }
     
//       const publicUrl = await uploadImage(e);

//       if (!publicUrl || !email) {
//         throw new Error("Failed to upload image");
//       }

//       const result = await updateAvatar({email, avatar: publicUrl});
     
//       if(result?.success){
//         toast({
//           title: "Avatar updated successfully",
//           variant:'success'
//         })

//         setUserProfile((prev:any) =>{
//           return {
//             ...prev,
//             image:publicUrl
//           }
//         })
//       }else{
//         throw new Error("Failed to update avatar");
//       }
       
//     }catch(err){
//       console.error("Error uploading image:", err);
//       toast({
//         title: "Error uploading image",
//         description: err instanceof Error ? err.message : "Please try again",
//         variant:'destructive'
//       });

//       setImagePreview(userProfile?.image || null);
//     }finally{

//     }
//   };

//   const onSubmit = async (data: ProfileFormData) => {
//     try {
//       // First handle image upload if there's a new image
//       let imageUrl = userProfile?.image;
      
//       if (data.image && data.image.length > 0) {
//         // Create a synthetic event object for uploadImage
//         const uploadEvent = {
//           target: {
//             files: data.image
//           }
//         } as unknown as React.ChangeEvent<HTMLInputElement>;
        
//         imageUrl = await uploadImage(uploadEvent);
        
//         if (!imageUrl) {
//           toast({
//             title: "Image upload failed",
//             variant: "destructive"
//           });
//           return;
//         }
        
//         // Update avatar in user profile
//         if (session?.user?.email) {
//           await updateAvatar({ 
//             email: session.user.email,
//             avatar: imageUrl 
//           });
//         }
//       }
      
//       // Update the rest of the profile data
//       const updatedProfileData = {
//         name: data.name,
//         gender: data.gender,
//         city: data.city,
//         state: data.state,
//         country: data.country,
//       };
      
//       const updatedProfile = await updateUserProfile(updatedProfileData);
      
//       if (!updatedProfile) {
//         throw new Error("Failed to update profile");
//       }
      
//       // Update local state with server response
//       setUserProfile({
//         ...updatedProfile,
//         image: imageUrl  // Use the new image URL if available
//       });
      
//       toast({
//         title: "Profile updated successfully",
//       });
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast({
//         title: "Error updating profile",
//         description: error instanceof Error ? error.message : "Please try again",
//         variant: "destructive"
//       });
//     }
//   };
 
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
//       <Card className="w-full max-w-4xl overflow-hidden">
//         <div className="md:flex">
//           <div className="md:w-1/3 bg-primary/5 p-6 flex flex-col items-center justify-center">
//             <div className="relative">
//               <Avatar className="w-32 h-32 mb-4">
//                 <AvatarImage
//                   src={imagePreview || "/placeholder.svg?height=128&width=128"}
//                   alt={userProfile?.name || "User"}
//                 />
//                 <AvatarFallback>
//                   {userProfile?.name
//                     ?.split(" ")
//                     .map((n: string) => n[0])
//                     .join("")}
//                 </AvatarFallback>
//               </Avatar>
//               <label
//                 htmlFor="image-upload"
//                 className="absolute bottom-4 right-0 cursor-pointer"
//               >
//                 <div className="rounded-full bg-neutral-700 p-2 text-white hover:bg-neutral-500/90">
//                  <Camera className="w-6 h-6" />
//                 </div>
//               </label>
//               <input
//                 type="file"
//                 id="image-upload"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageChange}
//               />
//             </div>
          
//             <CardTitle className="text-2xl font-bold mb-2">
//               {userProfile?.name}
//             </CardTitle>
//             <Button onClick={() => signOut()}>Sign Out</Button>
//           </div>
//           <div className="md:w-2/3 p-6">
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <CardHeader className="px-0 pt-0">
//                 <CardTitle className="text-3xl font-bold">
//                   Edit Profile
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="px-0 space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="username">Username</Label>
//                     <Input id="username" value={userProfile?.username || ''} disabled />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input id="email" value={userProfile?.email || ''} disabled />
//                   </div>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Name</Label>
//                     <Input id="name" {...register("name")} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="city">City</Label>
//                     <Input id="city" {...register("city")} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="state">State</Label>
//                     <Input id="state" {...register("state")} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="country">Country</Label>
//                     <Input id="country" {...register("country")} />
//                   </div>
//                 </div>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="gender">Gender</Label>
//                     <Select
//                       onValueChange={(value) => setValue("gender", value)}
//                       value={userProfile?.gender || ""}
//                     >
//                       <SelectTrigger id="gender">
//                         <SelectValue placeholder="Select gender" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="male">Male</SelectItem>
//                         <SelectItem value="female">Female</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="px-0 pb-0">
//                 <Button  type="submit" className="w-full">
//                   Save Changes
//                 </Button>
//               </CardFooter>
//             </form>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default ProfilePage;
