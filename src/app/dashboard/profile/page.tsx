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
import { signOut } from "next-auth/react";

const ProfilePage = () => {

  const [name, setName] = useState("John Doe");
  const [location, setLocation] = useState("New York, USA");
  const [gender, setGender] = useState("male");

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-primary/5 p-6 flex flex-col items-center justify-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                src="/placeholder.svg?height=128&width=128"
                alt={name}
              />
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold mb-2">{name}</CardTitle>
            <p className="text-muted-foreground text-center">{location}</p>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
          <div className="md:w-2/3 p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-3xl font-bold">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value="johndoe123"
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value="john.doe@example.com"
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
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
              <Button className="w-full">Save Changes</Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
