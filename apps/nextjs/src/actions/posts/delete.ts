"use server";

// Imports
// ============================================================
import { api } from "@/providers/trpc/server";
import { revalidatePath } from "next/cache";

// Action
// ============================================================
export const postDelete = async (formData: FormData) => {
  const id = formData.get("id") as string;
  await api.posts.delete({ id });
  revalidatePath("/");
};
