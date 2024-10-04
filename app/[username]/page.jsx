import { getUserByUsername } from "@/actions/users";
import { notFound } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EventCard from "@/components/EventCard";

export async function generateMetadata({ params }) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    return {
      title: "User not found",
    };
  }
  return {
    title: `${user.name}'s Profile | MeetSync`,
    description: `Book an event with ${user.name}. View available public events and schedules.`,
  };
}

const UserPage = async ({ params }) => {
  const user = await getUserByUsername(params.username);
  if (!user) {
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <a
          className="text-slate-600 duration-200 hover:text-green-600"
          href={`mailto:${user.email}`}
        >
          {user.email}
        </a>
        <p className="text-center text-slate-600">
          Welcome to my scheduling page. Please create an event to schedule a
          time with me, or check out my upcoming events.
        </p>
      </div>

      {user.events.length === 0 ? (
        <p className="text-center text-slate-600">
          No public events scheduled.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user.events.map((event) => {
            return (
              <EventCard
                key={event.id}
                event={event}
                username={params.username}
                isPublic={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPage;
