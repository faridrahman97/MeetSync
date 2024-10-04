import React, { Suspense } from "react";
import { getUserEvents } from "@/actions/events";
import EventCard from "@/components/EventCard";

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading Events...</div>}>
      <Events />
    </Suspense>
  );
}
const Events = async () => {
  const { events, username } = await getUserEvents();

  if (events.length === 0) {
    return <div>You haven&apos;t created any events.</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event} event={event} username={username} />
      ))}
    </div>
  );
};
