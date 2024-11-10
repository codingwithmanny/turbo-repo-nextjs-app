"use client";

// Imports
// ============================================================
import React from "react";
import { api } from "@/providers/trpc";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { useToast } from "@repo/ui/hooks/use-toast";

// Component
// ============================================================
export const PostsCreate = () => {
  // Requests
  const { toast } = useToast();
  const postsCreate = api.posts.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating post",
        description: error.message,
      });
    },
  });

  // Functions
  /**
   * Handles form submission
   */
  const onSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postsCreate.mutateAsync({
      title: event.currentTarget.inputTitle.value,
      content: event.currentTarget.inputContent.value,
    });
  };

  // Render
  return <section>
    <h3>Create Post</h3>
    {postsCreate.isPending
      ? <div>Submitting...</div>
      : <form onSubmit={onSubmitCreate}>
        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="inputTitle" className="text-sm font-medium">Title</Label>
          <Input disabled={postsCreate.isPending} id="inputTitle" type="text" name="inputTitle" placeholder="Title" />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="inputContent" className="text-sm font-medium">Content</Label>
          <Input disabled={postsCreate.isPending} id="inputContent" type="text" name="inputContent" placeholder="Content" />
        </div>
        <Button disabled={postsCreate.isPending} type="submit">Create</Button>
      </form>}
  </section>
};
