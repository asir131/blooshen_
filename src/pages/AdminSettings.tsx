import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MasterAdminLayout from "@/components/admin-master/MasterAdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Save, X, Plus, RefreshCw } from "lucide-react";

type Settings = {
  id: number;
  min_description_length: number;
  min_images_required: number;
  max_price_threshold: number;
  min_price_threshold: number;
  placeholder_words: string[];
  auto_block_on_critical: boolean;
  email_alerts_enabled: boolean;
  alert_email: string | null;
  auto_scan_on_submit: boolean;
  scan_frequency: string;
};

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [newWord, setNewWord] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle();
    setSettings(data as Settings);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!settings || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("platform_settings")
      .update({
        min_description_length: settings.min_description_length,
        min_images_required: settings.min_images_required,
        max_price_threshold: settings.max_price_threshold,
        min_price_threshold: settings.min_price_threshold,
        placeholder_words: settings.placeholder_words,
        auto_block_on_critical: settings.auto_block_on_critical,
        email_alerts_enabled: settings.email_alerts_enabled,
        alert_email: settings.alert_email,
        auto_scan_on_submit: settings.auto_scan_on_submit,
        scan_frequency: settings.scan_frequency,
        updated_by: user.id,
      })
      .eq("id", 1);
    if (error) {
      toast.error("Could not save settings");
    } else {
      toast.success("Settings saved");
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "EDITED",
        entity_type: "platform_settings",
        entity_id: null,
        metadata: { settings },
      });
    }
    setSaving(false);
  };

  const runFullScan = async () => {
    setScanning(true);
    try {
      const { data: pending } = await supabase
        .from("vehicle_listings")
        .select("id")
        .in("status", ["pending_review", "draft"])
        .limit(100);
      if (!pending?.length) {
        toast.info("No pending listings to scan");
        return;
      }
      const results = await Promise.allSettled(
        pending.map((l) => supabase.functions.invoke("integrity-agent", { body: { listing_id: l.id } })),
      );
      const ok = results.filter((r) => r.status === "fulfilled").length;
      toast.success(`Scanned ${ok}/${pending.length}`);
    } finally {
      setScanning(false);
    }
  };

  const addWord = () => {
    if (!settings || !newWord.trim()) return;
    if (settings.placeholder_words.includes(newWord.trim().toLowerCase())) return;
    setSettings({
      ...settings,
      placeholder_words: [...settings.placeholder_words, newWord.trim().toLowerCase()],
    });
    setNewWord("");
  };

  const removeWord = (word: string) => {
    if (!settings) return;
    setSettings({ ...settings, placeholder_words: settings.placeholder_words.filter((w) => w !== word) });
  };

  if (loading) {
    return (
      <MasterAdminLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </MasterAdminLayout>
    );
  }
  if (!settings) {
    return (
      <MasterAdminLayout>
        <Card className="border-border bg-card p-6 text-muted-foreground">Settings not available.</Card>
      </MasterAdminLayout>
    );
  }

  return (
    <MasterAdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase tracking-wider text-foreground">Settings</h1>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Platform settings */}
        <Card className="border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-foreground">
            Platform Settings
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Min description length</Label>
                <Input
                  type="number"
                  value={settings.min_description_length}
                  onChange={(e) =>
                    setSettings({ ...settings, min_description_length: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Min images required</Label>
                <Input
                  type="number"
                  value={settings.min_images_required}
                  onChange={(e) =>
                    setSettings({ ...settings, min_images_required: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Min price ($)</Label>
                <Input
                  type="number"
                  value={settings.min_price_threshold}
                  onChange={(e) =>
                    setSettings({ ...settings, min_price_threshold: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Max price ($)</Label>
                <Input
                  type="number"
                  value={settings.max_price_threshold}
                  onChange={(e) =>
                    setSettings({ ...settings, max_price_threshold: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Placeholder words</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {settings.placeholder_words.map((w) => (
                  <Badge key={w} variant="secondary" className="gap-1">
                    {w}
                    <button onClick={() => removeWord(w)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Add word…"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addWord())}
                />
                <Button variant="secondary" onClick={addWord}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label className="cursor-pointer">Auto-block on critical flag</Label>
                <p className="text-xs text-muted-foreground">
                  Listings with critical flags are automatically blocked.
                </p>
              </div>
              <Switch
                checked={settings.auto_block_on_critical}
                onCheckedChange={(v) => setSettings({ ...settings, auto_block_on_critical: v })}
              />
            </div>

            <div className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer">Email alerts</Label>
                <Switch
                  checked={settings.email_alerts_enabled}
                  onCheckedChange={(v) => setSettings({ ...settings, email_alerts_enabled: v })}
                />
              </div>
              {settings.email_alerts_enabled && (
                <Input
                  className="mt-2"
                  type="email"
                  placeholder="alerts@example.com"
                  value={settings.alert_email ?? ""}
                  onChange={(e) => setSettings({ ...settings, alert_email: e.target.value })}
                />
              )}
            </div>
          </div>
        </Card>

        {/* Agent settings */}
        <Card className="border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-foreground">
            Integrity Agent
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label className="cursor-pointer">Auto-scan on submit</Label>
                <p className="text-xs text-muted-foreground">
                  Run the agent automatically when a listing enters review.
                </p>
              </div>
              <Switch
                checked={settings.auto_scan_on_submit}
                onCheckedChange={(v) => setSettings({ ...settings, auto_scan_on_submit: v })}
              />
            </div>

            <div>
              <Label>Scheduled scan frequency</Label>
              <Select
                value={settings.scan_frequency}
                onValueChange={(v) => setSettings({ ...settings, scan_frequency: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every 1 hour</SelectItem>
                  <SelectItem value="6h">Every 6 hours</SelectItem>
                  <SelectItem value="daily">Every 24 hours</SelectItem>
                  <SelectItem value="manual">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={runFullScan} disabled={scanning}>
              {scanning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Run Full System Scan Now
            </Button>
          </div>
        </Card>
      </div>
    </MasterAdminLayout>
  );
};

export default AdminSettings;
