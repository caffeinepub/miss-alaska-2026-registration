import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Crown,
  ExternalLink,
  LogIn,
  LogOut,
  RefreshCw,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Registration } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllRegistrations, useIsAdmin } from "../hooks/useQueries";

function formatDate(timestamp: bigint): string {
  // timestamp is sequential ID, show as entry number
  return `Entry #${timestamp.toString()}`;
}

function formatDOB(dob: string): string {
  if (!dob) return "—";
  try {
    return new Date(dob).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dob;
  }
}

function DetailRow({
  label,
  value,
}: { label: string; value?: string | number | bigint }) {
  const display =
    value !== undefined && value !== null && String(value) !== ""
      ? String(value)
      : "—";
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide sm:w-40 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground">{display}</span>
    </div>
  );
}

function RegistrationDetail({ reg }: { reg: Registration }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="border-t border-border bg-muted/30 px-4 py-5 space-y-5">
        {/* Personal Info */}
        <div className="space-y-2">
          <h4 className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full section-number-1 text-white text-xs flex items-center justify-center">
              1
            </span>
            Personal Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
            <DetailRow label="Full Name" value={reg.fullName} />
            <DetailRow
              label="Date of Birth"
              value={formatDOB(reg.dateOfBirth)}
            />
            <DetailRow label="Age" value={Number(reg.age)} />
            <DetailRow label="Address" value={reg.address} />
            <DetailRow label="Contact Number" value={reg.contactNumber} />
            <DetailRow
              label="Emergency Contact"
              value={reg.emergencyContactName}
            />
            <DetailRow
              label="Emergency Phone"
              value={reg.emergencyContactPhone}
            />
          </div>
        </div>

        {/* Physical */}
        <div className="space-y-2">
          <h4 className="font-display text-sm font-bold text-rose flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full section-number-2 text-white text-xs flex items-center justify-center">
              2
            </span>
            Physical & Background
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
            <DetailRow label="Height" value={reg.height || "—"} />
            <DetailRow label="Weight" value={reg.weight || "—"} />
            <DetailRow
              label="Measurements"
              value={
                reg.bust || reg.waist || reg.hips
                  ? `Bust: ${reg.bust}" | Waist: ${reg.waist}" | Hips: ${reg.hips}"`
                  : "—"
              }
            />
            <DetailRow label="Education" value={reg.educationLevel} />
            <DetailRow
              label="Occupation/School"
              value={reg.occupationOrSchool}
            />
            <DetailRow
              label="Hobbies & Interests"
              value={reg.hobbiesInterests}
            />
            <DetailRow label="Talent / Skills" value={reg.talentSkills} />
            <DetailRow
              label="Pageant Experience"
              value={reg.previousPageantExperience}
            />
          </div>
        </div>

        {/* Media */}
        <div className="space-y-2">
          <h4 className="font-display text-sm font-bold text-gold-dark flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full section-number-3 text-white text-xs flex items-center justify-center">
              3
            </span>
            Media & Bio
          </h4>
          <div className="pl-7 space-y-3">
            <div className="flex flex-wrap gap-3">
              {reg.headshotBlob ? (
                <a
                  href={reg.headshotBlob.getDirectURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                  data-ocid="admin.headshot.link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Headshot
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">
                  No headshot uploaded
                </span>
              )}
              {reg.fullBodyPhotoBlob ? (
                <a
                  href={reg.fullBodyPhotoBlob.getDirectURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                  data-ocid="admin.fullbody.link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Full-Body Photo
                </a>
              ) : (
                <span className="text-sm text-muted-foreground ml-3">
                  No full-body photo uploaded
                </span>
              )}
            </div>
            {reg.bioPlatformStatement && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Brief story about yours
                </span>
                <p className="text-sm text-foreground leading-relaxed bg-white rounded-lg p-3 border border-border">
                  {reg.bioPlatformStatement}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RegistrationRow({
  reg,
  index,
}: {
  reg: Registration;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-pageant transition-shadow"
      data-ocid={`admin.registration.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full text-left flex items-center gap-3 px-4 py-4 hover:bg-muted/30 transition-colors group"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        data-ocid={`admin.registration.row.${index + 1}`}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground truncate">
              {reg.fullName}
            </span>
            <Badge variant="secondary" className="text-xs shrink-0">
              Age {Number(reg.age)}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-3">
            <span>DOB: {formatDOB(reg.dateOfBirth)}</span>
            <span>📞 {reg.contactNumber || "—"}</span>
            <span className="text-muted-foreground/60">
              {formatDate(reg.timestamp)}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && <RegistrationDetail reg={reg} />}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminPage() {
  const { login, clear, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const {
    data: registrations,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllRegistrations();

  const principal = identity?.getPrincipal().toString();

  return (
    <div className="min-h-screen pageant-bg">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/90 via-primary to-purple-800/90 py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-white/70 text-sm mt-0.5">
                Miss Alaska 2026 — Registrations
              </p>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white/60 text-xs">Logged in as</p>
                <p className="text-white text-xs font-mono truncate max-w-[140px]">
                  {principal?.slice(0, 8)}...{principal?.slice(-4)}
                </p>
              </div>
              <Button
                data-ocid="admin.logout.button"
                variant="outline"
                size="sm"
                onClick={clear}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Log Out
              </Button>
            </div>
          ) : (
            <Button
              data-ocid="admin.login.button"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="bg-gold hover:bg-gold-dark text-amber-900 font-semibold shadow-gold"
            >
              {isLoggingIn || isInitializing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to View Registrations
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Not logged in state */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
            data-ocid="admin.login.panel"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Crown className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Admin Access Required
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Log in with your Internet Identity to access the registration
              dashboard. Only authorized administrators can view submissions.
            </p>
            <Button
              data-ocid="admin.login.primary_button"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-pageant rounded-full px-8"
            >
              {isLoggingIn || isInitializing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Logged in but not admin */}
        {isLoggedIn && !checkingAdmin && isAdmin === false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
            data-ocid="admin.unauthorized.error_state"
          >
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Your account does not have admin privileges. Please follow the
                steps below to gain access.
              </AlertDescription>
            </Alert>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2 pt-5 px-6">
                <CardTitle className="text-amber-900 text-base flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-700" />
                  How to get admin access
                </CardTitle>
                <p className="text-sm text-amber-800 mt-1">
                  You need to log in using a special <strong>Admin URL</strong>{" "}
                  that contains a secret token. Here is how to find it:
                </p>
              </CardHeader>
              <CardContent className="pb-5 px-6 space-y-4">
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold text-sm flex items-center justify-center mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Log out first
                      </p>
                      <p className="text-sm text-amber-800 mt-0.5">
                        Click the <strong>"Log Out"</strong> button at the top
                        right of this page.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold text-sm flex items-center justify-center mt-0.5">
                      2
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Open your Caffeine project
                      </p>
                      <p className="text-sm text-amber-800 mt-0.5">
                        Go to{" "}
                        <a
                          href="https://caffeine.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium hover:text-amber-900"
                          data-ocid="admin.caffeine_dashboard.link"
                        >
                          caffeine.ai
                        </a>
                        , find your <strong>Miss Alaska 2026</strong> project
                        card, and <strong>click the project name</strong> to
                        open the project detail page.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold text-sm flex items-center justify-center mt-0.5">
                      3
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Find the Admin URL inside the project
                      </p>
                      <p className="text-sm text-amber-800 mt-0.5">
                        Inside the project detail page, look for a section or
                        button labeled <strong>"Admin URL"</strong>,{" "}
                        <strong>"Admin Access"</strong>, or a key icon. It may
                        also be listed under a <strong>"Links"</strong> or{" "}
                        <strong>"Share"</strong> section. Copy that link — it
                        will look like the regular app URL but with{" "}
                        <code className="bg-amber-100 px-1 rounded text-xs">
                          caffeineAdminToken=...
                        </code>{" "}
                        at the end.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold text-sm flex items-center justify-center mt-0.5">
                      4
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Open that Admin URL and log in
                      </p>
                      <p className="text-sm text-amber-800 mt-0.5">
                        Paste the Admin URL into your browser, then click{" "}
                        <strong>"Login with Internet Identity"</strong>. Admin
                        access will be granted automatically.
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="mt-2 p-3 bg-amber-100 rounded-lg border border-amber-300">
                  <p className="text-xs text-amber-800">
                    <strong>Still stuck?</strong> On caffeine.ai, click your
                    profile icon (top right) and use{" "}
                    <strong>"Share feedback"</strong> to contact Caffeine
                    support. Include your Project ID (shown when you click the
                    project name).
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Admin content */}
        {isLoggedIn && (checkingAdmin || isAdmin) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Stats */}
            {!isLoading && !checkingAdmin && isAdmin && (
              <Card className="shadow-pageant">
                <CardContent className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Registrations
                      </p>
                      <p className="font-display text-3xl font-bold text-foreground">
                        {registrations?.length ?? 0}
                      </p>
                    </div>
                    <Button
                      data-ocid="admin.refresh.button"
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      disabled={isFetching}
                      className="ml-auto"
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading state */}
            {(isLoading || checkingAdmin) && (
              <div
                className="space-y-3"
                data-ocid="admin.registrations.loading_state"
              >
                {["sk1", "sk2", "sk3", "sk4"].map((id) => (
                  <div key={id} className="border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <Alert
                variant="destructive"
                data-ocid="admin.registrations.error_state"
              >
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Failed to load registrations. Make sure you have admin access,
                  then try refreshing.
                </AlertDescription>
              </Alert>
            )}

            {/* Registrations list */}
            {!isLoading && !checkingAdmin && isAdmin && !isError && (
              <div className="space-y-3">
                {registrations && registrations.length === 0 ? (
                  <div
                    className="text-center py-16 border border-border rounded-xl bg-card"
                    data-ocid="admin.registrations.empty_state"
                  >
                    <Crown className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                    <h3 className="font-display text-lg font-bold text-muted-foreground">
                      No registrations yet
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Registrations will appear here once candidates start
                      applying.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-display text-lg font-bold text-foreground">
                        All Registrations
                      </h2>
                      <Badge variant="outline" className="text-xs">
                        Sorted by newest first
                      </Badge>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block">
                      <Card
                        className="shadow-pageant overflow-hidden"
                        data-ocid="admin.registrations.table"
                      >
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                              <TableHead className="font-semibold">#</TableHead>
                              <TableHead className="font-semibold">
                                Full Name
                              </TableHead>
                              <TableHead className="font-semibold">
                                Age
                              </TableHead>
                              <TableHead className="font-semibold">
                                Contact Number
                              </TableHead>
                              <TableHead className="font-semibold">
                                Date of Birth
                              </TableHead>
                              <TableHead className="font-semibold">
                                Submission
                              </TableHead>
                              <TableHead />
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[...(registrations ?? [])]
                              .reverse()
                              .map((reg, i) => (
                                <DesktopRegistrationRow
                                  key={`reg-desktop-${reg.timestamp}`}
                                  reg={reg}
                                  index={i}
                                />
                              ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                      {[...(registrations ?? [])].reverse().map((reg, i) => (
                        <RegistrationRow
                          key={`reg-mobile-${reg.timestamp}`}
                          reg={reg}
                          index={i}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground mt-16 space-y-1">
        <p>
          © {new Date().getFullYear()} Miss Alaska 2026 — Alakple Beauty
          Pageant.
        </p>
        <p>
          Built by{" "}
          <span className="font-medium text-foreground">@digitasoja</span> with
          love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

function DesktopRegistrationRow({
  reg,
  index,
}: {
  reg: Registration;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded((prev) => !prev)}
        data-ocid={`admin.registration.row.${index + 1}`}
      >
        <TableCell className="font-medium text-muted-foreground">
          {index + 1}
        </TableCell>
        <TableCell className="font-semibold text-foreground">
          {reg.fullName}
        </TableCell>
        <TableCell>{Number(reg.age)}</TableCell>
        <TableCell className="font-mono text-sm">
          {reg.contactNumber || "—"}
        </TableCell>
        <TableCell>{formatDOB(reg.dateOfBirth)}</TableCell>
        <TableCell className="text-muted-foreground text-xs">
          {formatDate(reg.timestamp)}
        </TableCell>
        <TableCell>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow data-ocid={`admin.registration.item.${index + 1}`}>
          <TableCell colSpan={7} className="p-0">
            <RegistrationDetail reg={reg} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
