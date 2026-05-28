// app/api/admin/users/route.ts
// يجلب كل المستخدمين باستخدام service_role (server-side فقط)

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ADMIN_ID = "4c33904a-2041-48de-a53d-907f5b532a18";

// Supabase Admin Client (service_role — server only)
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // هذا المتغير سري — لا يُكشف للعميل
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  // التحقق من أن الطالب هو الأدمن
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // جلب كل المستخدمين من auth.users عبر service_role
  const { data: authUsers, error: authError } =
    await adminSupabase.auth.admin.listUsers({ perPage: 1000 });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // جلب profiles مع الإحصائيات
  const { data: profiles } = await adminSupabase
    .from("profiles")
    .select("id, username, full_name, country, plan, status, created_at, last_seen");

  // جلب عدد جهات الاتصال لكل مستخدم
  const { data: contactCounts } = await adminSupabase
    .from("contacts")
    .select("user_id");

  // جلب عدد QR codes
  const { data: qrCounts } = await adminSupabase
    .from("qr_codes")
    .select("user_id");

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p])
  );

  const contactCountMap: Record<string, number> = {};
  (contactCounts ?? []).forEach((c: { user_id: string }) => {
    contactCountMap[c.user_id] = (contactCountMap[c.user_id] || 0) + 1;
  });

  const qrCountMap: Record<string, number> = {};
  (qrCounts ?? []).forEach((q: { user_id: string }) => {
    qrCountMap[q.user_id] = (qrCountMap[q.user_id] || 0) + 1;
  });

  const users = authUsers.users.map((u) => {
    const profile = profileMap.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "",
      username: profile?.username ?? null,
      full_name: profile?.full_name ?? null,
      country: profile?.country ?? null,
      plan: profile?.plan ?? "free",
      status: profile?.status ?? "active",
      created_at: profile?.created_at ?? u.created_at,
      last_seen: profile?.last_seen ?? null,
      last_sign_in_at: u.last_sign_in_at ?? null,
      contacts_count: contactCountMap[u.id] ?? 0,
      qr_count: qrCountMap[u.id] ?? 0,
    };
  });

  // ترتيب من الأحدث إلى الأقدم
  users.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return NextResponse.json(users);
}
