// Profile Service
// Business logic for profile operations
import { supabase } from "../../db/supabase";

export const getProfileService = async (userId: string, email: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  let profile = data;

  // Auto-create profile if it doesn't exist
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email: email,
        onboarding_completed: false,
      })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);
    profile = newProfile;
  }

  // Count active (non-archived) habits
  const { count, error: countError } = await supabase
    .from("habits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_archived", false);

  if (countError) throw new Error(countError.message);

  return {
    ...profile,
    active_habit_count: count ?? 0,
  };
};

export const completeOnboardingService = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};