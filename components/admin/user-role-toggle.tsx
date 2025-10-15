"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/toast";

interface UserRoleToggleProps {
  userId: string;
  userEmail: string;
  initialIsAdmin: boolean;
  currentUserId: string;
}

export function UserRoleToggle({
  userId,
  userEmail,
  initialIsAdmin,
  currentUserId,
}: UserRoleToggleProps) {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [isUpdating, setIsUpdating] = useState(false);
  const isCurrentUser = userId === currentUserId;

  const handleToggle = async (checked: boolean) => {
    if (isCurrentUser && !checked) {
      toast({
        type: "error",
        description: "You cannot remove your own admin privileges",
      });
      return;
    }

    const previousState = isAdmin;
    setIsUpdating(true);
    // Optimistically update the UI
    setIsAdmin(checked);

    try {
      const response = await fetch("/admin/users/api", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin: checked }),
      });

      if (!response.ok) {
        const error = await response.json();
        // Revert the optimistic update on error
        setIsAdmin(previousState);
        throw new Error(error.error || "Failed to update user role");
      }

      toast({
        type: "success",
        description: `${userEmail} is now ${checked ? "an admin" : "a regular user"}`,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        type: "error",
        description: error instanceof Error ? error.message : "Failed to update user role",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isAdmin ? (
        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          Admin
        </span>
      ) : (
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          User
        </span>
      )}
      <Switch
        checked={isAdmin}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        aria-label={`Toggle admin role for ${userEmail}`}
      />
    </div>
  );
}
