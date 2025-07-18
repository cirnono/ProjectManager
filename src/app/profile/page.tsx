import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { users } from "@/utils/users";
import { ProfileForm } from "./ProfileForm";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  if (!user) redirect("/login");

  const userData = await users.getUser(user.id);
  if (!userData) redirect("/login");

  return <ProfileForm initialData={userData} />;
}
