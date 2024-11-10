"use client";

// Imports
// ============================================================
import React, { useState } from "react";
import { api } from "@/providers/trpc";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { useToast } from "@repo/ui/hooks/use-toast";

// Component
// ============================================================
export const PostsUpdate = ({
  post,
}: {
  post: { id: string; title: string; content: string };
}) => {
  // State
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = useState({
    title: post.title,
    content: post.content,
  });

  // Requests
  const { toast } = useToast();
  const postsUpdate = api.posts.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Post updated successfully",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating post",
        description: error.message,
      });
    },
  });

  // Functions
  /**
   * Handles form submission
   */
  const onSubmitUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postsUpdate.mutateAsync({
      id: post.id,
      title: event.currentTarget.inputTitle.value,
      content: event.currentTarget.inputContent.value,
    });
  };

  // Render
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={onSubmitUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>Modify your post here.</DialogDescription>
            </DialogHeader>
            <div className="mb-4">
              <Label htmlFor="inputTitle" className="text-sm font-medium">
                Title
              </Label>
              <Input
                disabled={postsUpdate.isPending}
                id="inputTitle"
                type="text"
                name="inputTitle"
                placeholder="Title"
                value={input.title}
                onChange={(e) => setInput({ ...input, title: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="inputContent" className="text-sm font-medium">
                Content
              </Label>
              <Input
                disabled={postsUpdate.isPending}
                id="inputContent"
                type="text"
                name="inputContent"
                placeholder="Content"
                value={input.content}
                onChange={(e) =>
                  setInput({ ...input, content: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button disabled={postsUpdate.isPending} type="submit">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
