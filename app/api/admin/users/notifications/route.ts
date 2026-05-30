import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ADMIN_ID = "ccc18481-95a4-4aee-b795-5311cf560c52";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_ID)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, body, target, userId } = await req.json();

  let userIds: string[] = [];
  if (target === "all") {
    const { data } = await adminSupabase.from("profiles").select("id");
    userIds = data?.map((r) => r.id) || [];
  } else if (target === "pro" || target === "free") {
    const { data } = await adminSupabase.from("profiles").select("id").eq("plan", target);
    userIds = data?.map((r) => r.id) || [];
  } else if (target === "user" && userId) {
    const isUUID = /^[0-9a-f-]{36}$/i.test(userId);
    if (isUUID) {
      userIds = [userId];
    } else {
      const { data } = await adminSupabase.from("profiles").select("id").eq("email", userId).limit(1);
      userIds = data?.map((r) => r.id) || [];
    }
  }

  if (!userIds.length)
    return NextResponse.json({ error: "No users found" }, { status: 400 });

  const rows = userIds.map((uid) => ({ user_id: uid, title, body, is_read: false }));
  const { error } = await adminSupabase.from("notifications").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, sent: userIds.length });
}