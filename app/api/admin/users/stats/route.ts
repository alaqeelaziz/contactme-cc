import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_ID = "ccc18481-95a4-4aee-b795-5311cf560c52";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_ID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Total users
  const { count: total_users } = await adminSupabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Today signups
  const today = new Date().toISOString().slice(0, 10);
  const { count: today_signups } = await adminSupabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${today}T00:00:00`);

  // Pro users
  const { count: pro_users } = await adminSupabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("plan", "pro");

  // Banned users
  const { count: banned_users } = await adminSupabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("status", "banned");

  // Countries
  const { data: countryData } = await adminSupabase
    .from("profiles")
    .select("country")
    .not("country", "is", null);

  const countryCounts: Record<string, number> = {};
  countryData?.forEach((r) => {
    const c = r.country || "غير محدد";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const countries = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  // Daily signups last 14 days
  const daily_signups: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const { count } = await adminSupabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${dateStr}T00:00:00`)
      .lt("created_at", `${dateStr}T23:59:59`);
    daily_signups.push({ date: dateStr, count: count || 0 });
  }

  return NextResponse.json({
    total_users,
    today_signups,
    pro_users,
    banned_users,
    countries,
    daily_signups,
  });
}