import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Check, XCircle, Info, Flag, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrokerApplication, ApplicationStatus } from "@/data/mockBrokerApplications";
import { rejectionReasons } from "@/data/mockBrokerApplications";

interface ApplicationDetailPanelProps {
  application: BrokerApplication;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ApplicationStatus, reason?: string) => void;
}

const statusBadgeClasses: Record<ApplicationStatus, string> = {
  pending: "bg-[hsl(var(--primary))] text-[#1A1A1A]",
  under_review: "bg-orange-500 text-white",
  approved: "bg-green-600 text-white",
  rejected: "bg-red-600 text-white",
  suspended: "bg-gray-500 text-white",
  waitlisted: "bg-blue-500 text-white",
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
  waitlisted: "Waitlisted",
};

type PanelTab = "overview" | "application" | "verification" | "notes";

const ApplicationDetailPanel = ({ application: app, onClose, onUpdateStatus }: ApplicationDetailPanelProps) => {
  const [activeTab, setActiveTab] = useState<PanelTab>("overview");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState(rejectionReasons[0]);
  const [rejectNotes, setRejectNotes] = useState("");
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [newNote, setNewNote] = useState("");

  const tabs: { id: PanelTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "application", label: "Application" },
    { id: "verification", label: "Verification" },
    { id: "notes", label: "Notes" },
  ];

  const scoreColor = (score: number) =>
    score >= 80 ? "text-green-400" : score >= 60 ? "text-[hsl(var(--primary))]" : "text-red-400";

  const initials = app.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-[#0f0f0f] border-l border-[hsl(var(--primary))] z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#1e1e1e]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-heading font-bold text-foreground">{app.name}</h3>
                <Badge className={cn("text-[10px]", statusBadgeClasses[app.status])}>
                  {statusLabels[app.status]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {app.email} · {app.city}, {app.state} · {app.appliedDate}
              </p>
            </div>
            <button onClick={onClose} className="text-[hsl(var(--primary))] hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-[10px]" onClick={() => setShowApproveConfirm(true)}>
              <Check className="h-3 w-3 mr-1" /> Approve
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-[10px]" onClick={() => setShowRejectModal(true)}>
              <XCircle className="h-3 w-3 mr-1" /> Reject
            </Button>
            <Button size="sm" variant="outline" className="text-[10px] border-[hsl(var(--primary))] text-[hsl(var(--primary))]">
              <Info className="h-3 w-3 mr-1" /> Request Info
            </Button>
            <Button size="sm" variant="outline" className="text-[10px] border-red-500 text-red-500">
              <Flag className="h-3 w-3 mr-1" /> Flag
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1e1e1e]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-2.5 text-xs font-heading font-bold uppercase tracking-wider transition-colors border-b-2",
                activeTab === tab.id
                  ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "overview" && (
            <>
              {/* Profile preview */}
              <div className="bg-[#242424] rounded-xl border border-[#2a2a2a] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-16 w-16 rounded-full bg-[hsl(var(--primary))]/20 border-2 border-[hsl(var(--primary))] flex items-center justify-center text-lg font-bold text-[hsl(var(--primary))]">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{app.name}</p>
                    <p className="text-[11px] text-muted-foreground italic">{app.tagline}</p>
                    <p className="text-[10px] text-[hsl(var(--primary))]">autowurx.com/experts/{app.username}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{app.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {app.specialties.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full border border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Score widget */}
              <div className="bg-[#242424] rounded-xl border border-[#2a2a2a] p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-20 w-20 shrink-0">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#333" strokeWidth="2" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={app.score >= 80 ? "#22c55e" : app.score >= 60 ? "#FFE000" : "#ef4444"}
                        strokeWidth="2" strokeDasharray={`${app.score} ${100 - app.score}`} strokeLinecap="round"
                      />
                    </svg>
                    <span className={cn("absolute inset-0 flex items-center justify-center text-xl font-bold", scoreColor(app.score))}>
                      {app.score}
                    </span>
                  </div>
                  <div className="space-y-1 flex-1">
                    {[
                      { label: "Profile Completeness", val: app.scoreBreakdown.profileCompleteness, max: 30 },
                      { label: "Bio Quality", val: app.scoreBreakdown.bioQuality, max: 20 },
                      { label: "Specialties", val: app.scoreBreakdown.specialties, max: 10 },
                      { label: "Identity Verified", val: app.scoreBreakdown.identityVerified, max: 20 },
                      { label: "Social Connected", val: app.scoreBreakdown.socialConnected, max: 20 },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-28 shrink-0">{r.label}</span>
                        <div className="flex-1 h-1.5 bg-[#333] rounded-full overflow-hidden">
                          <div className="h-full bg-[hsl(var(--primary))] rounded-full" style={{ width: `${(r.val / r.max) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-10 text-right">{r.val}/{r.max}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coverage gap */}
              <div className="bg-[#242424] rounded-xl border border-[#2a2a2a] p-4">
                <p className="text-xs font-heading font-bold text-foreground mb-2">📍 Coverage Analysis</p>
                <div className="h-20 bg-[#1a1a1a] rounded-lg mb-2 flex items-center justify-center text-xs text-muted-foreground">
                  Map placeholder
                </div>
                <p className="text-xs text-muted-foreground">
                  {app.distanceMi} miles from nearest active broker in this zip code
                </p>
                <Badge className={cn("mt-1 text-[10px]", app.distanceMi > 10 ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400")}>
                  {app.distanceMi > 10 ? "Coverage needed here" : `${Math.round(3 - app.distanceMi / 5)} active brokers within 5 miles`}
                </Badge>
              </div>
            </>
          )}

          {activeTab === "application" && (
            <div className="space-y-4">
              {[
                { title: "Eligibility (Step 1)", items: [
                  ["Self-description", app.selfDescription],
                  ["Heard from", app.heardFrom],
                  ["Prior referral", app.priorReferral],
                ]},
                { title: "Profile (Step 2)", items: [
                  ["Display name", app.name],
                  ["Username", app.username],
                  ["Tagline", app.tagline],
                  ["Bio", app.bio],
                  ["Specialties", app.specialties.join(", ")],
                ]},
                { title: "Verification (Step 3)", items: [
                  ["Phone", `${app.phoneVerified ? "✓ Verified" : "⚠ Pending"} ${app.phoneVerifiedAt || ""}`],
                  ["ID Check", `${app.idVerified ? `✓ ${app.idMethod}` : "⚠ Pending"} ${app.idVerifiedAt || ""}`],
                ]},
                { title: "Connections (Step 4)", items: [
                  ["Social", app.connectedSocials.length > 0 ? app.connectedSocials.join(", ") : "None"],
                  ["Payout", app.payoutMethod || "Not set"],
                  ["Schedule", app.payoutSchedule],
                  ["Featured vehicles", String(app.featuredVehicles)],
                ]},
              ].map((section) => (
                <div key={section.title} className="bg-[#242424] rounded-xl border border-[#2a2a2a] p-4">
                  <p className="text-xs font-heading font-bold text-[hsl(var(--primary))] uppercase tracking-wider mb-3">{section.title}</p>
                  <div className="space-y-2">
                    {section.items.map(([label, value]) => (
                      <div key={label} className="flex gap-2">
                        <span className="text-[11px] text-muted-foreground w-28 shrink-0">{label}</span>
                        <span className="text-[11px] text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "verification" && (
            <div className="space-y-4">
              <div className="bg-[#242424] rounded-xl border border-[#2a2a2a] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", app.idVerified ? "bg-green-600/20" : "bg-yellow-600/20")}>
                    {app.idVerified ? <Check className="h-5 w-5 text-green-400" /> : <Info className="h-5 w-5 text-yellow-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{app.idVerified ? "Identity Verified" : "Verification Pending"}</p>
                    <p className="text-[10px] text-muted-foreground">{app.idMethod || "No method selected"}</p>
                  </div>
                </div>
                {app.idVerified && (
                  <div className="space-y-1.5 text-xs">
                    {[
                      ["Method", app.idMethod],
                      ["Verified", app.idVerifiedAt],
                      ["Provider", "Persona (TODO)"],
                      ["Confidence", `${app.idConfidence}%`],
                      ["Name match", `✓ ${app.name}`],
                      ["DOB verified", "✓"],
                      ["Address match", "✓"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between">
                        <span className="text-muted-foreground">{l}</span>
                        <span className="text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#242424] rounded-xl border border-[#2a2a2a] p-4">
                <p className="text-xs font-heading font-bold text-foreground mb-2">Phone Verification</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Number</span><span className="text-foreground">{app.phone}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Verified</span><span className="text-foreground">{app.phoneVerified ? `✓ ${app.phoneVerifiedAt}` : "⚠ Pending"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="text-foreground">SMS OTP</span></div>
                </div>
              </div>

              <div className="bg-[#242424] rounded-xl border border-[#2a2a2a] p-4 opacity-60">
                <p className="text-xs font-heading font-bold text-foreground mb-1">🔒 Enhanced Background Check</p>
                <p className="text-[10px] text-muted-foreground mb-2">Premium feature — not yet integrated</p>
                <Button size="sm" variant="outline" className="text-[10px] border-[hsl(var(--primary))] text-[hsl(var(--primary))]">
                  Run Check →
                </Button>
                {/* TODO: Integrate Checkr or similar API */}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              {/* Add note */}
              <div className="bg-[#242424] rounded-xl border border-[#2a2a2a] p-4">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add an internal note..."
                  className="bg-[#1a1a1a] border-[#333] text-xs min-h-[60px] mb-2"
                />
                <Button size="sm" className="text-[10px]" disabled={!newNote.trim()}>
                  Post Note
                </Button>
              </div>

              {/* Existing notes */}
              {app.adminNotes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Admin Notes</p>
                  {app.adminNotes.map((note, i) => (
                    <div key={i} className="bg-[#242424] rounded-lg border border-[#2a2a2a] p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-medium text-foreground">{note.admin}</span>
                        <span className="text-[10px] text-muted-foreground">{note.createdAt}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{note.note}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Activity log */}
              <div className="space-y-1">
                <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-2">Activity Log</p>
                {app.activityLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 py-1.5">
                    <div className="h-2 w-2 mt-1 rounded-full bg-[hsl(var(--primary))] shrink-0" />
                    <div>
                      <p className="text-[11px] text-foreground">{entry.event}</p>
                      <p className="text-[10px] text-muted-foreground">{entry.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Approve confirmation */}
        {showApproveConfirm && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
            <div className="bg-[#242424] rounded-xl border border-[#333] p-5 max-w-sm w-full">
              <p className="text-sm font-bold text-foreground mb-2">Approve {app.name}?</p>
              <p className="text-xs text-muted-foreground mb-4">
                Their profile will go live immediately at autowurx.com/experts/{app.username}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setShowApproveConfirm(false)} className="text-xs flex-1">Cancel</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs flex-1" onClick={() => { onUpdateStatus(app.id, "approved"); setShowApproveConfirm(false); }}>
                  Confirm Approval
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reject modal */}
        {showRejectModal && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
            <div className="bg-[#242424] rounded-xl border border-[#333] p-5 max-w-sm w-full">
              <p className="text-sm font-bold text-foreground mb-3">Reject {app.name}?</p>
              <label className="text-[11px] text-muted-foreground mb-1 block">Reason</label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] text-foreground text-xs rounded-md px-3 py-2 mb-3 focus:border-[hsl(var(--primary))] outline-none"
              >
                {rejectionReasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Additional notes (optional)..."
                className="bg-[#1a1a1a] border-[#333] text-xs min-h-[60px] mb-3"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setShowRejectModal(false)} className="text-xs flex-1">Cancel</Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs flex-1" onClick={() => { onUpdateStatus(app.id, "rejected", rejectReason); setShowRejectModal(false); }}>
                  Send Rejection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationDetailPanel;
