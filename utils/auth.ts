import { createClient } from "./supabase/client";
import { users } from "./users";

const supabase = createClient();

export type AuthError = {
  message: string;
  status?: number;
};

export const auth = {
  async signUp(email: string, password: string) {
    // check if the user already exist
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    // if exists, throw error. user already exists
    if (existingUser) {
      throw new Error(
        "This email is already registered. Try signing in instead"
      );
    }

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    // if not, signup user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      throw new Error("Fail to create user account");
    }

    if (!data.user) {
      throw new Error("Failed to create user account");
    }

    // save user detail
    if (data.user.identities?.length === 0) {
      try {
        await users.captureUserDetails(data.user);
      } catch (profileError) {
        await supabase.auth.admin.deleteUser(data.user.id);
        throw profileError;
      }
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      await users.captureUserDetails(data.user);
    }

    return data;
  },

  async signInWithAuth(provider: "github" | "google", nextUrl?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${nextUrl || "/"}`,
      },
    });

    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw { message: error.message, status: error.status };
  },

  async resetPasswordRequest(email: string) {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, provider")
      .eq("email", email)
      .single();

    if (userError && userError.code !== "PGRST116") {
      throw userError;
    }

    // prevent email enumeration attacks
    if (!user || user.provider !== "email") {
      return {
        success: true,
        message: "If an account exists, a password reset link will be sent.",
      };
    }

    const resetLink = `${location.origin}/auth/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetLink,
    });

    if (error) throw error;

    return {
      success: true,
      message: "If an account exists, a password reset link will be sent.",
    };
  },

  async resetPassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    console.log(error);
    if (error) throw { message: error.message, status: error.status };
    return data;
  },
};
