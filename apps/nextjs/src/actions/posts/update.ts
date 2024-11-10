"use server";

// Imports
// ============================================================
import { api } from "@/providers/trpc/server";
import { revalidatePath } from "next/cache";

// Action
// ============================================================
export const postUpdate = async (formData: FormData) => {
  const title = formData.get("title") as string ?? "";
  const content = formData.get("content") as string ?? "";
  const id = formData.get("id") as string ?? "";
  await api.posts.update({ id, title, content });
  revalidatePath("/");
};
