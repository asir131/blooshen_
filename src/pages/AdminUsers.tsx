import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, AppRole } from "@/hooks/useAuth";
import MasterAdminLayout from "@/components/admin-master/MasterAdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, UserCog, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Row = {
  profile_id: string;
  user_id: string;
  full_name: string | null;
  display_name: string | null;
  email: string | null;
  is_active: boolean;
  last_login: string | null;
  roles: AppRole[];
  listing_count: number;
};

const AdminUsers = () => {
  const { user, isMasterAdmin } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "admin" as AppRole });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roleRows }, { data: vlRows }] = await Promise.all([
      supabase.from("profiles").select("id, user_id, full_name, display_name, email, is_active, last_login"),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("vehicle_listings").select("created_by"),
    ]);

    const rolesByUser: Record<string, AppRole[]> = {};
    (roleRows ?? []).forEach((r) => {
      rolesByUser[r.user_id] = [...(rolesByUser[r.user_id] ?? []), r.role as AppRole];
    });
    const listingByProfile: Record<string, number> = {};
    (vlRows ?? []).forEach((r) => {
      listingByProfile[r.created_by] = (listingByProfile[r.created_by] ?? 0) + 1;
    });

    const built: Row[] = (profiles ?? [])
      .map((p) => ({
        profile_id: p.id,
        user_id: p.user_id,
        full_name: p.full_name,
        display_name: p.display_name,
        email: p.email,
        is_active: p.is_active,
        last_login: p.last_login,
        roles: rolesByUser[p.user_id] ?? [],
        listing_count: listingByProfile[p.id] ?? 0,
      }))
      // show admins/master_admins first
      .filter((r) => r.roles.includes("admin") || r.roles.includes("master_admin") || true);

    setRows(built);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const masterAdminCount = rows.filter((r) => r.roles.includes("master_admin")).length;

  const updateRole = async (row: Row, newRole: AppRole) => {
    if (!isMasterAdmin) return;
    // remove existing admin/master_admin roles for this user, set new one
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", row.user_id)
      .in("role", ["admin", "master_admin"]);
    const { error } = await supabase.from("user_roles").insert({ user_id: row.user_id, role: newRole });
    if (error) {
      toast.error("Failed to update role");
      return;
    }
    if (user) {
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "EDITED",
        entity_type: "user_role",
        entity_id: row.user_id,
        metadata: { new_role: newRole },
      });
    }
    toast.success("Role updated");
    load();
  };

  const toggleActive = async (row: Row) => {
    if (!isMasterAdmin) return;
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !row.is_active })
      .eq("id", row.profile_id);
    if (error) {
      toast.error("Failed to update status");
      return;
    }
    toast.success(row.is_active ? "User deactivated" : "User activated");
    load();
  };

  const deleteUser = async (row: Row) => {
    if (!isMasterAdmin || !user) return;
    if (row.user_id === user.id) {
      toast.error("Cannot delete your own account");
      return;
    }
    if (row.roles.includes("master_admin") && masterAdminCount <= 1) {
      toast.error("Cannot delete the last master admin");
      return;
    }
    // soft delete: deactivate + remove roles
    await supabase.from("user_roles").delete().eq("user_id", row.user_id);
    await supabase.from("profiles").update({ is_active: false }).eq("id", row.profile_id);
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "DELETED",
      entity_type: "user",
      entity_id: row.user_id,
      metadata: { email: row.email },
    });
    toast.success("User removed");
    setConfirmDelete(null);
    load();
  };

  const submitAdd = async () => {
    if (!form.full_name || !form.email || form.password.length < 8) {
      toast.error("Fill all fields, password ≥ 8 chars");
      return;
    }
    setSubmitting(true);
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", form.email)
        .maybeSingle();
      if (existing) {
        toast.error("Email already in use");
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name, display_name: form.full_name } },
      });
      if (error || !data.user) {
        toast.error(error?.message ?? "Failed to create user");
        return;
      }
      // give role
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: form.role });
      // update profile
      await supabase.from("profiles").update({ full_name: form.full_name }).eq("user_id", data.user.id);
      if (user) {
        await supabase.from("audit_logs").insert({
          user_id: user.id,
          action: "CREATED",
          entity_type: "user",
          entity_id: data.user.id,
          metadata: { email: form.email, role: form.role },
        });
      }
      toast.success("Admin created");
      setShowAdd(false);
      setForm({ full_name: "", email: "", password: "", role: "admin" });
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const initials = (name: string | null, email: string | null) =>
    (name ?? email ?? "?")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <MasterAdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase tracking-wider text-foreground">User Management</h1>
        {isMasterAdmin && (
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Admin
          </Button>
        )}
      </div>

      <Card className="border-border bg-card p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Listings</th>
                <th className="px-4 py-3 text-left">Last Login</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const role = r.roles.includes("master_admin")
                  ? "master_admin"
                  : r.roles.includes("admin")
                  ? "admin"
                  : r.roles[0] ?? "user";
                return (
                  <tr key={r.profile_id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs">
                            {initials(r.full_name, r.email)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{r.full_name ?? r.display_name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      {isMasterAdmin && (role === "admin" || role === "master_admin") ? (
                        <Select value={role} onValueChange={(v) => updateRole(r, v as AppRole)}>
                          <SelectTrigger className="h-7 w-[140px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">ADMIN</SelectItem>
                            <SelectItem value="master_admin">MASTER ADMIN</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={
                            role === "master_admin"
                              ? "rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase text-primary-foreground"
                              : "rounded bg-muted px-2 py-0.5 text-[11px] font-bold uppercase text-foreground"
                          }
                        >
                          {role.replace("_", " ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={r.is_active}
                          onCheckedChange={() => toggleActive(r)}
                          disabled={!isMasterAdmin}
                        />
                        <span className="text-xs text-muted-foreground">{r.is_active ? "Active" : "Inactive"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.listing_count}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {r.last_login ? formatDistanceToNow(new Date(r.last_login), { addSuffix: true }) : "Never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isMasterAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDelete(r)}
                          disabled={r.user_id === user?.id}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add admin modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-wider">
              <UserCog className="mr-2 inline h-5 w-5 text-primary" />
              Add Admin
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Full name</Label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Password (min 8 chars)</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as AppRole })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  {isMasterAdmin && <SelectItem value="master_admin">Master Admin</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={submitAdd} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This deactivates the account and removes all admin roles. This cannot be undone from this UI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete && deleteUser(confirmDelete)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MasterAdminLayout>
  );
};

export default AdminUsers;
