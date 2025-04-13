"use client";
import React, { useState, useEffect, useMemo, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createMatchPreference,
} from "@/actions/match.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { MapPin, Languages, Users, GitCommit } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { getMatchPreferencesFetcher } from "@/components/fetchers/fetchers";
const matchPreferenceSchema = z.object({
  ageRange: z.array(z.number()).length(2).default([18, 99]),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  gender: z.string().min(1, "Gender is required"),
  minContributions: z
    .number()
    .min(0, "Minimum contributions must be at least 0"),
});

type MatchPreferenceFormInputs = z.infer<typeof matchPreferenceSchema>;
 
const MatchPreferencePage = () => {
  const [languageInput, setLanguageInput] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const session = useSession();
  const email = session?.data?.user?.email;
  const form = useForm<MatchPreferenceFormInputs>({
    resolver: zodResolver(matchPreferenceSchema),
    defaultValues: {
      ageRange: [18, 99],
      languages: [],
      city: "",
      state: "",
      country: "",
      gender: "",
      minContributions: 0,
    },
  });

  const {data:matchPreference, error:matchPreferenceError, isLoading: matchPreferenceLoding} = useSWR(
    email ? ["matchPreference", email] : null,
    ([_,email]) => getMatchPreferencesFetcher(email),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  )
  const preferences = matchPreference?.additional
 
  useEffect(() => {
          if (preferences) {
            form.reset({
              ageRange: [preferences.ageMin ?? 18, preferences.ageMax ?? 99],
              languages: preferences.languages ?? [],
              city: preferences.city ?? "",
              state: preferences.state ?? "",
              country: preferences.country ?? "",
              gender: preferences.gender ?? "",
              minContributions: preferences.minContributions ?? 0,
            });
            setSelectedLanguages(preferences.languages ?? []);
          }
  }, [matchPreference]);

  const onSubmit = async (data: MatchPreferenceFormInputs) => {
    try {
      const result = await createMatchPreference({
        ...data,
        ageMin: data.ageRange[0],
        ageMax: data.ageRange[1],
      });
      if (result) {
        toast({
          title: "Match preferences saved successfully!",
          variant: "default",
        });
        form.reset();
        setSelectedLanguages([]);
      } else {
        toast({
          title: "Failed to save preferences",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({ title: "An error occurred. Please try again." });
    }
  };

  const handleAddLanguage = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && languageInput.trim()) {
      e.preventDefault();
      if (!selectedLanguages.includes(languageInput.trim())) {
        const newLanguages = [...selectedLanguages, languageInput.trim()];
        setSelectedLanguages(newLanguages);
        form.setValue("languages", newLanguages);
      }
      setLanguageInput("");
    }
  };

  const removeLanguage = (language: string) => {
    const newLanguages = selectedLanguages.filter((l) => l !== language);
    setSelectedLanguages(newLanguages);
    form.setValue("languages", newLanguages);
  };

  if (matchPreferenceLoding) {
    return (
      <div>
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl rounded-2xl border-none">
            <CardHeader>
              <Skeleton className="h-14 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-5 ">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full mx-auto">
        <Card className="border-none">
          {matchPreferenceLoding ? (
            <CardContent className="flex justify-center py-6">
              <div>Loading...</div>
            </CardContent>
          ) : (
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gitdate">
                Match Preferences
              </CardTitle>
              <CardDescription>
                Set your preferences to find the perfect coding partner
              </CardDescription>
            </CardHeader>
          )}
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 gap-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age Range</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={18}
                              max={99}
                              step={1}
                              value={field.value}
                              onValueChange={field.onChange}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gitdate">
                              <span>From {field.value[0]} years</span>
                              <span>To {field.value[1]} years</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Programming Languages</FormLabel>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Languages className="w-4 h-4 text-gitdate" />
                        <Input
                          placeholder="Type a language and press Enter"
                          value={languageInput}
                          onChange={(e) => setLanguageInput(e.target.value)}
                          onKeyDown={handleAddLanguage}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedLanguages.map((lang) => (
                          <Badge
                            key={lang}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeLanguage(lang)}
                          >
                            {lang} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gitdate" />
                            <Input
                              placeholder="Enter your preferred location"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gitdate" />
                            <Input
                              placeholder="Enter your preferred location"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gitdate" />
                            <Input
                              placeholder="Enter your preferred location"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gitdate" />
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select preferred gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non-binary">
                                  Non-binary
                                </SelectItem>
                                <SelectItem value="any">Any</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minContributions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum GitHub Contributions</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <GitCommit className="w-4 h-4 text-gitdate" />
                            <Input
                              type="number"
                              placeholder="Minimum number of contributions"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Set the minimum number of GitHub contributions
                          required
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Button type="submit" className="w-full">
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchPreferencePage;
