"use client";

import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// ─── Types ───────────────────────────────────────────────────────────────────
type Plan = "free" | "pro" | "enterprise";
type UserStatus = "active" | "banned" | "suspended";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  username: string;
  plan: Plan;
  status: UserStatus;
  country: string;
  last_seen: string;
  created_at: string;
}

interface Stats {
  total_users: number;
  today_signups: number;
  pro_users: number;
  banned_users: number;
  countries: { country: string; count: number }[];
  daily_signups: { date: string; count: number }[];
}

interface PlanConfig {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  max_contacts: number;
  features: string[];
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPanel() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "plans" | "notifications">("stats");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "", target: "all", userId: "" });
  const [sending, setSending] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch Stats ──
  const fetchStats = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/stats");
    if (res.ok) setStats(await res.json());
    setLoading(false);
  }, []);

  // ── Fetch Users ──
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, [search]);

  // ── Fetch Plans ──
  const fetchPlans = useCallback(async () => {
    const { data } = await supabase.from("plans").select("*").order("price_monthly");
    if (data) setPlans(data);
  }, [supabase]);

  useEffect(() => {
    if (activeTab === "stats") fetchStats();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "plans") fetchPlans();
  }, [activeTab, fetchStats, fetchUsers, fetchPlans]);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [search, activeTab, fetchUsers]);

  // ── Update User ──
  const updateUser = async (id: string, updates: Partial<AdminUser>) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      showToast("تم التحديث ✓");
      fetchUsers();
    } else {
      showToast("فشل التحديث", "error");
    }
  };

  // ── Delete User ──
  const deleteUser = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("تم الحذف ✓"); fetchUsers(); }
    else showToast("فشل الحذف", "error");
  };

  // ── Save Plan ──
  const savePlan = async () => {
    if (!editingPlan) return;
    const { error } = await supabase.from("plans").upsert(editingPlan);
    if (!error) { showToast("تم حفظ الخطة ✓"); setEditingPlan(null); fetchPlans(); }
    else showToast("فشل الحفظ", "error");
  };

  // ── Send Notification ──
  const sendNotification = async () => {
    if (!notification.title || !notification.body) return showToast("الرجاء ملء العنوان والمحتوى", "error");
    setSending(true);
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });
    setSending(false);
    if (res.ok) {
      showToast("تم الإرسال ✓");
      setNotification({ title: "", body: "", target: "all", userId: "" });
    } else showToast("فشل الإرسال", "error");
  };

  const tabs = [
    { id: "stats", label: "📊 الإحصائيات" },
    { id: "users", label: "👥 المستخدمون" },
    { id: "plans", label: "💰 الخطط" },
    { id: "notifications", label: "📢 الإشعارات" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6" dir="rtl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-medium shadow-xl transition-all ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">🛡️ لوحة الإدارة</h1>
        <p className="text-gray-400 mt-1 text-sm">contactme.cc — إدارة شاملة للمنصة</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── STATS TAB ── */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-gray-500 py-20">جاري التحميل...</div>
          ) : stats ? (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي المستخدمين", value: stats.total_users, color: "indigo", icon: "👥" },
                  { label: "تسجيلات اليوم", value: stats.today_signups, color: "emerald", icon: "🆕" },
                  { label: "مستخدمو Pro", value: stats.pro_users, color: "amber", icon: "⭐" },
                  { label: "محظورون", value: stats.banned_users, color: "red", icon: "🚫" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700/50">
                    <div className="text-2xl mb-2">{kpi.icon}</div>
                    <div className="text-3xl font-bold text-white">{kpi.value}</div>
                    <div className="text-gray-400 text-sm mt-1">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Daily Signups Chart */}
              <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4">📈 تسجيلات آخر 14 يوم</h3>
                <div className="flex items-end gap-2 h-32">
                  {stats.daily_signups?.map((d, i) => {
                    const max = Math.max(...stats.daily_signups.map((x) => x.count), 1);
                    const height = Math.round((d.count / max) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.count}
                        </div>
                        <div
                          className="w-full rounded-t bg-indigo-500 hover:bg-indigo-400 transition-all cursor-default"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                        <div className="text-xs text-gray-500 -rotate-45 origin-top-right whitespace-nowrap">
                          {d.date?.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Countries */}
              <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4">🌍 توزيع الدول (أعلى 10)</h3>
                <div className="space-y-3">
                  {stats.countries?.slice(0, 10).map((c) => {
                    const max = stats.countries[0]?.count || 1;
                    return (
                      <div key={c.country} className="flex items-center gap-3">
                        <div className="w-28 text-sm text-gray-300 text-right truncate">{c.country || "غير محدد"}</div>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full transition-all"
                            style={{ width: `${(c.count / max) * 100}%` }}
                          />
                        </div>
                        <div className="text-sm text-gray-400 w-8 text-left">{c.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-20">لا توجد بيانات</div>
          )}
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث بالاسم أو الإيميل..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Table */}
          <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400">
                    <th className="text-right px-4 py-3">المستخدم</th>
                    <th className="text-right px-4 py-3">الخطة</th>
                    <th className="text-right px-4 py-3">الحالة</th>
                    <th className="text-right px-4 py-3">الدولة</th>
                    <th className="text-right px-4 py-3">آخر ظهور</th>
                    <th className="text-right px-4 py-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-500">جاري التحميل...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-500">لا يوجد مستخدمون</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{u.full_name || "—"}</div>
                        <div className="text-gray-400 text-xs">{u.email}</div>
                        {u.username && <div className="text-gray-500 text-xs">@{u.username}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.plan || "free"}
                          onChange={(e) => updateUser(u.id, { plan: e.target.value as Plan })}
                          className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.status || "active"}
                          onChange={(e) => updateUser(u.id, { status: e.target.value as UserStatus })}
                          className={`bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                            u.status === "banned" ? "text-red-400" : u.status === "suspended" ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          <option value="active">✅ نشط</option>
                          <option value="suspended">⚠️ موقوف</option>
                          <option value="banned">🚫 محظور</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{u.country || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {u.last_seen ? new Date(u.last_seen).toLocaleDateString("ar-SA") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-gray-500 text-xs border-t border-gray-700">
              {users.length} مستخدم
            </div>
          </div>
        </div>
      )}

      {/* ── PLANS TAB ── */}
      {activeTab === "plans" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white capitalize">{plan.name}</h3>
                  <button
                    onClick={() => setEditingPlan({ ...plan })}
                    className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-600/40 transition-colors"
                  >
                    تعديل
                  </button>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  ${plan.price_monthly}<span className="text-sm text-gray-400">/شهر</span>
                </div>
                <div className="text-gray-400 text-sm mb-4">${plan.price_yearly}/سنة</div>
                <div className="text-sm text-gray-300">
                  <span className="text-indigo-400 font-medium">{plan.max_contacts === -1 ? "∞" : plan.max_contacts}</span> جهة اتصال
                </div>
                <div className="mt-3 space-y-1">
                  {plan.features?.map((f, i) => (
                    <div key={i} className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="text-emerald-500">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Edit Modal */}
          {editingPlan && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setEditingPlan(null)}>
              <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-5">تعديل خطة {editingPlan.name}</h3>
                <div className="space-y-4">
                  {[
                    { label: "السعر الشهري ($)", key: "price_monthly", type: "number" },
                    { label: "السعر السنوي ($)", key: "price_yearly", type: "number" },
                    { label: "الحد الأقصى للجهات (-1 = لامحدود)", key: "max_contacts", type: "number" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm text-gray-400 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        value={(editingPlan as any)[field.key]}
                        onChange={(e) => setEditingPlan({ ...editingPlan, [field.key]: Number(e.target.value) })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">المميزات (كل سطر ميزة)</label>
                    <textarea
                      rows={4}
                      value={editingPlan.features?.join("\n")}
                      onChange={(e) => setEditingPlan({ ...editingPlan, features: e.target.value.split("\n").filter(Boolean) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={savePlan} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
                    حفظ التغييرات
                  </button>
                  <button onClick={() => setEditingPlan(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === "notifications" && (
        <div className="max-w-xl">
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50 space-y-4">
            <h3 className="text-lg font-semibold">إرسال إشعار</h3>

            {/* Target */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">المستهدف</label>
              <div className="flex gap-2">
                {[{ v: "all", l: "🌐 الكل" }, { v: "pro", l: "⭐ Pro فقط" }, { v: "free", l: "🆓 Free فقط" }, { v: "user", l: "👤 مستخدم محدد" }].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => setNotification({ ...notification, target: opt.v })}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${notification.target === opt.v ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>

            {/* User ID if specific */}
            {notification.target === "user" && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">User ID أو الإيميل</label>
                <input
                  value={notification.userId}
                  onChange={(e) => setNotification({ ...notification, userId: e.target.value })}
                  placeholder="أدخل UUID أو الإيميل"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان</label>
              <input
                value={notification.title}
                onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                placeholder="عنوان الإشعار..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">المحتوى</label>
              <textarea
                rows={4}
                value={notification.body}
                onChange={(e) => setNotification({ ...notification, body: e.target.value })}
                placeholder="نص الإشعار..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              onClick={sendNotification}
              disabled={sending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl py-3 text-sm font-medium transition-colors"
            >
              {sending ? "جاري الإرسال..." : "📢 إرسال الإشعار"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}