
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserMenuLayout = "desktop" | "mobile";

interface UserMenuProps {
  layout?: UserMenuLayout;
}

export default function UserMenu({ layout }: UserMenuProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Update Name
  const handleUpdateName = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!name.trim()) return;

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        alert(error.message);
        return;
      }

      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async (): Promise<void> => {
    await authClient.signOut();
    setOpen(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">

     

      {/* Right Side */}
      {!isPending && (
        <div className="flex items-center gap-3">

          {!user ? (
            <>
              <Button variant="outline" >
                <Link href="/login">Login</Link>
              </Button>

              <Button >
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <Dialog
              open={open}
              onOpenChange={(value) => {
                setOpen(value);

                if (value) {
                  setName(user.name || "");
                }
              }}
            >
              {/* Profile Icon */}
              <DialogTrigger >
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Avatar>
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DialogTrigger>

              {/* Profile Dialog */}
              <DialogContent className="sm:max-w-[400px]">

                <DialogHeader>
                  <DialogTitle>My Profile</DialogTitle>
                  <DialogDescription>
                    Manage your account.
                  </DialogDescription>
                </DialogHeader>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Change Name */}
                <form onSubmit={handleUpdateName} className="space-y-3">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Name"}
                  </Button>
                </form>

                {/* Logout */}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>

              </DialogContent>
            </Dialog>
          )}

        </div>
      )}
    </nav>
  );
}
