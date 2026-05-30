// app/api/admin/users/[id]/route.ts

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ADMIN_ID = "4c33904a-2041-48de-a53d-907f5b532a18";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── Helper: التحقق من الأدمن ──────────────────────────────────────────────
async function verifyAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id === ADMIN_ID ? user : null;
}

// ── DELETE: حذف مستخدم ───────────────────────────────────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const userId = params.id;
  if (userId === ADMIN_ID) {
    return NextResponse.json({ error: "Cannot delete admin account" }, { status: 400 });
  }

  const { error } = await adminSupabase.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// ── PATCH: تحديث بيانات مستخدم (خطة، حالة، إلخ) ──────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const userId = params.id;
  if (userId === ADMIN_ID) {
    return NextResponse.json({ error: "Cannot modify admin account" }, { status: 400 });
  }

  const updates = await req.json();

  // حماية: السماح فقط بالحقول المصرح بها
  const allowedFields = ["plan", "status", "country"];
  const safeUpdates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) safeUpdates[key] = updates[key];
  }

  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { error } = await adminSupabase
    .from("profiles")
    .update(safeUpdates)
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}