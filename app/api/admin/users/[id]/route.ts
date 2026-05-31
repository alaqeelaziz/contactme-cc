import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ADMIN_ID = "5085f0e4-eb5c-4da6-86f9-ebcc2f98e574";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function verifyAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id === ADMIN_ID ? user : null;
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  if (params.id === ADMIN_ID)
    return NextResponse.json({ error: "Cannot delete admin account" }, { status: 400 });

  const { error } = await adminSupabase.auth.admin.deleteUser(params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  if (params.id === ADMIN_ID)
    return NextResponse.json({ error: "Cannot modify admin account" }, { status: 400 });

  const updates = await req.json();
  const allowedFields = ["plan", "status", "country"];
  const safeUpdates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) safeUpdates[key] = updates[key];
  }

  if (!Object.keys(safeUpdates).length)
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });

  const { error } = await adminSupabase.from("profiles").update(safeUpdates).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
