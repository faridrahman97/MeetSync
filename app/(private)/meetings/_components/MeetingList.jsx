"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, Clock, Video } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cancelMeeting } from "@/actions/meetings";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";

const MeetingList = ({ meetings, type }) => {
  const router = useRouter();
  const { loading, error, fn: fnCancelMeeting } = useFetch(cancelMeeting);
  const handleCancel = async (meetingId) => {
    if (window.confirm("Are you sure you want to cancel this meeting?")) {
      await fnCancelMeeting(meetingId);
      router.refresh();
    }
  };
  if (meetings.length === 0) {
    return <p>No {type} meetings found.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => {
        return (
          <Card key={meeting.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{meeting.event.title}</CardTitle>
              <CardDescription>From {meeting.name}</CardDescription>
              <CardDescription>
                &quot;{meeting.event.description}&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  {format(new Date(meeting.startTime), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  {format(new Date(meeting.startTime), "h:mm a")} -{" "}
                  {format(new Date(meeting.endTime), "h:mm a")}
                </span>
              </div>
              {meeting.meetLink && (
                <div className="flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </CardContent>
            {type === "upcoming" && (
              <CardFooter>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={() => handleCancel(meeting.id)}
                >
                  {loading ? "Cancelling..." : "Cancel Meeting"}
                </Button>
                {error && (
                  <span className="text-sm text-red-500">{error.message}</span>
                )}
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default MeetingList;
