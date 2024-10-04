"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/app/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import { Link } from "lucide-react";
import { getLatestUpdates } from "@/actions/dashboard";

const Dashboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { isLoaded, user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${user?.username}`
      );
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  useEffect(() => {
    setValue("username", user?.username);
  }, [isLoaded]);
  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const {
    loading: loadingUpdates,
    data: meetings,
    fn: fnGetLatestUpdates,
  } = useFetch(getLatestUpdates);

  useEffect(() => {
    (async () => await fnGetLatestUpdates())();
  }, []);

  const onSubmit = async (data) => {
    await fnUpdateUsername(data.username);
  };
  useUser();
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}</CardTitle>
        </CardHeader>
        <CardContent>
          {!loadingUpdates ? (
            <div className="mb-4">
              {meetings && meetings.length > 0 ? (
                <ul>
                  {meetings.map((meeting) => {
                    return (
                      <li key={meeting.id}>
                        - {meeting.event.title} on{" "}
                        {format(
                          new Date(meeting.startTime),
                          "MMMM d, yyyy h:mm a"
                        )}{" "}
                        with {meeting.name}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No upcoming meetings</p>
              )}
            </div>
          ) : (
            <p>Loading updates...</p>
          )}
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleCopy}
          >
            <Link className="mr-2 h-4 w-4" />
            {isCopied ? "Copied!" : "Grab your link"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>
        </CardHeader>
        {/* Latest Updates */}
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Input {...register("username")} placeholder="Username" />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
              )}
            </div>
            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <Button type="submit">Update Username</Button>
          </form>
        </CardContent>
        {/* Latest Updates */}
      </Card>
      <Card></Card>
    </div>
  );
};

export default Dashboard;
