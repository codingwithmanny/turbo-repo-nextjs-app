"use server";

// Imports
// ============================================================
import { api } from "@/providers/trpc/server";
import { revalidatePath } from "next/cache";

// Action
// ============================================================
export const postCreate = async (formData: FormData) => {
  const title = formData.get("title") as string ?? "";
  const content = formData.get("content") as string ?? "";
  await api.posts.create({ title, content });
  revalidatePath("/");
};
