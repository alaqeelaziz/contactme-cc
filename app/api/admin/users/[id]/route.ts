// app/api/admin/users/[id]/route.ts
// حذف مستخدم باستخدام service_role

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const ADMIN_ID = "4c33904a-2041-48de-a53d-907f5b532a18";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // التحقق من صلاحية الأدمن
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const userId = params.id;

  // لا يمكن حذف الأدمن نفسه
  if (userId === ADMIN_ID) {
    return NextResponse.json(
      { error: "Cannot delete admin account" },
      { status: 400 }
    );
  }

  // حذف المستخدم من auth (يحذف البيانات المرتبطة عبر CASCADE)
  const { error } = await adminSupabase.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
