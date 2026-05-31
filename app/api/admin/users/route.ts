import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ADMIN_ID = "5085f0e4-eb5c-4da6-86f9-ebcc2f98e574";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_ID)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  let query = adminSupabase
    .from("profiles")
    .select("id, full_name, username, plan, status, country, last_seen, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // جلب الإيميلات من auth.users عبر adminSupabase
  const ids = data?.map((p) => p.id) || [];
  const usersWithEmail = await Promise.all(
    ids.map(async (id) => {
      const { data: authUser } = await adminSupabase.auth.admin.getUserById(id);
      return { id, email: authUser?.user?.email || "" };
    })
  );
  const emailMap = Object.fromEntries(usersWithEmail.map((u) => [u.id, u.email]));

  const result = data?.map((p) => ({ ...p, email: emailMap[p.id] || "" })) || [];
  return NextResponse.json(result);
}
