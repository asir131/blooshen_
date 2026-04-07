import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Bell, Shield } from "lucide-react";

const AccountSettings = () => (
  <div className="space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Account Settings</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-border bg-card">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-heading font-bold text-foreground flex items-center gap-2"><User className="h-4 w-4" /> Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Full Name</label>
              <Input defaultValue="Alex Johnson" className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Email</label>
              <Input defaultValue="alex@example.com" className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Phone</label>
              <Input defaultValue="(713) 555-0123" className="mt-1" />
            </div>
            <Button size="sm">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-heading font-bold text-foreground flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h3>
          <p className="text-sm text-muted-foreground">Configure email and push notification preferences.</p>
          <Button size="sm" variant="secondary">Manage Notifications</Button>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-heading font-bold text-foreground flex items-center gap-2"><Shield className="h-4 w-4" /> Security</h3>
          <p className="text-sm text-muted-foreground">Change password and manage two-factor authentication.</p>
          <Button size="sm" variant="secondary">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AccountSettings;
