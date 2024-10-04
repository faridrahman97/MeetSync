import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { SignedOut, SignedIn, UserButton, SignInButton } from "@clerk/nextjs";
import UserMenu from "./UserMenu";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();
  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2 bg-white">
      <Link href={"/"} className="flex items-center">
        <div className="flex items-center gap-1">
          <Image src="/calendar.png" width={45} height={45} alt="logo" />
          <p className="text-3xl md:text-4xl font-semibold tracking-wide text-green-700">
            MeetSync
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/events?create=true">
          <Button className="px-3 md:px-4">
            <PenBox className="md:mr-1" size={18} />
            <span className="hidden md:block">Create Event</span>
          </Button>
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu></UserMenu>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;
