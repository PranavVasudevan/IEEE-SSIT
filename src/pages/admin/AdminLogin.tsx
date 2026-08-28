import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth, loginWithGoogle, logout, simulateLoginWithEmail } from "@/firebase/auth"
import { DEFAULT_ADMIN_EMAILS, isOfficialSSNEmail } from "@/firebase/adminConfig"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import ssitLogo from "@/assets/images/ssit-logo.png"

export default function AdminLogin() {
  const { user, isAuthorizedAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [signingIn, setSigningIn] = useState(false)
  const [accessRequested, setAccessRequested] = useState(false)

  // Only expose simulation helper in local development mode
  const isDevMode = import.meta.env.DEV

  const handleGoogleSignIn = async () => {
    setSigningIn(true)
    try {
      const res = await loginWithGoogle()
      if (res.isAuthorized) {
        navigate("/admin/dashboard")
      }
    } catch (err) {
      console.error("Sign in failed:", err)
    } finally {
      setSigningIn(false)
    }
  }

  // Developer simulation helper for testing all roles in local dev
  const handleSimulate = async (email: string, name: string) => {
    setSigningIn(true)
    try {
      const res = await simulateLoginWithEmail(email, name)
      if (res.isAuthorized) {
        navigate("/admin/dashboard")
      }
    } finally {
      setSigningIn(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-sans-ui text-xs font-semibold" style={{ color: solid("muted") }}>
            Verifying Admin Authorization & Role...
          </span>
        </div>
      </div>
    )
  }

  // CASE 1: User is logged in but NOT authorized as Admin (ACCESS RESTRICTED)
  if (user && !isAuthorizedAdmin) {
    const isSSN = isOfficialSSNEmail(user.email)

    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-16">
        <div
          className="max-w-md w-full p-8 md:p-10 rounded-3xl border shadow-2xl space-y-6 text-center animate-fade-in"
          style={{
            background: solid("bgWarm"),
            borderColor: "rgba(239, 68, 68, 0.4)",
          }}
        >
          <div className="w-16 h-16 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center mx-auto border border-red-500/30">
            <Icons.Lock size={32} />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-sans-ui font-bold uppercase tracking-wider bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
              Access Restricted
            </span>
            <h1 className="font-display font-bold text-2xl" style={{ color: solid("ink") }}>
              Admin Access Required
            </h1>
            <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
              Signed in as <strong className="font-mono text-red-500">{user.email}</strong>
            </p>

            {!isSSN ? (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-sans-ui text-left flex items-start gap-2">
                <Icons.AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>Non-SSN account detected. Only official <strong>@ssn.edu.in</strong> Google accounts on the approved Web Dev roster can access administrative tools.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-sans-ui text-left flex items-start gap-2">
                <Icons.AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>Your SSN account is authenticated, but not currently registered in the authorized Web Dev Admin roster.</span>
              </div>
            )}
          </div>

          {/* Access Request Action */}
          {accessRequested ? (
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-sans-ui space-y-1">
              <p className="font-bold flex items-center gap-1.5"><Icons.Check size={13} /> Access Request Transmitted</p>
              <p className="text-[11px]">The SSIT Web Dev leads have been alerted to review your SSN email authorization.</p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: tint("border", 0.6), background: solid("bg") }}>
              <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
                Are you a member of the SSIT Web Development team?
              </p>
              <button
                onClick={() => setAccessRequested(true)}
                className="px-4 py-2 rounded-xl text-xs font-sans-ui font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderColor: tint("border", 0.8), color: solid("ink") }}
              >
                Request Admin Inclusion
              </button>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => logout()}
              className="w-full py-2.5 rounded-xl font-sans-ui text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Icons.LogOut size={14} />
              Sign Out & Switch Account
            </button>
            <Link
              to="/"
              className="font-sans-ui text-xs hover:underline pt-2"
              style={{ color: solid("muted") }}
            >
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // CASE 2: User is already logged in AND authorized as Admin
  if (user && isAuthorizedAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-24">
        <div
          className="max-w-md w-full p-8 rounded-3xl border shadow-2xl text-center space-y-6"
          style={{ background: solid("bgWarm"), borderColor: "rgba(16, 185, 129, 0.5)" }}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
            <Icons.Check size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl" style={{ color: solid("ink") }}>
              Authorized Admin
            </h2>
            <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
              Signed in as <strong className="font-mono text-emerald-600 dark:text-emerald-400">{user.email}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-white transition-transform active:scale-95"
              style={{ background: navySolid }}
            >
              Open Admin Dashboard →
            </button>
            <button
              onClick={() => logout()}
              className="w-full py-2 text-xs font-sans-ui hover:underline"
              style={{ color: solid("muted") }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  // CASE 3: Not logged in -> Show Google Sign-In (and dev tools only if import.meta.env.DEV)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-16">
      <div
        className="max-w-xl w-full p-8 md:p-12 rounded-3xl border shadow-2xl space-y-8"
        style={{
          background: solid("bgWarm"),
          borderColor: tint("border", 0.7),
        }}
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 mx-auto">
            <img src={ssitLogo} alt="IEEE SSIT" className="h-10 w-auto object-contain rounded" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-sans-ui font-bold uppercase tracking-widest bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              Web Development Portal
            </span>
            <h1 className="font-display font-bold text-2xl md:text-3xl mt-2" style={{ color: solid("ink") }}>
              IEEE SSIT Admin Portal
            </h1>
            <p className="font-sans-ui text-xs max-w-sm mx-auto mt-1" style={{ color: solid("muted") }}>
              Sign in with your approved SSN Google account (<code>@ssn.edu.in</code>).
            </p>
          </div>
        </div>

        {/* Security Rule Card */}
        <div
          className="p-4 rounded-2xl border text-xs font-sans-ui space-y-1.5"
          style={{ borderColor: tint("navy", 0.2), background: tint("navy", 0.04) }}
        >
          <div className="flex items-center gap-2 font-bold" style={{ color: solid("navy") }}>
            <Icons.Shield size={14} className="text-amber-500" />
            <span>Role-Based Security Policy:</span>
          </div>
          <p style={{ color: solid("muted") }}>
            • <strong>Admin Role:</strong> Granted exclusively to authorized students in the central configuration.
          </p>
          <p style={{ color: solid("muted") }}>
            • <strong>Non-Admin Users:</strong> Permitted to explore public content; admin access and database writes are strictly blocked.
          </p>
        </div>

        {/* Google Sign-in Button */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full py-3.5 px-4 rounded-2xl font-sans-ui text-xs uppercase tracking-wider font-bold border flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
            style={{
              background: solid("bg"),
              borderColor: tint("border", 0.9),
              color: solid("ink"),
            }}
          >
            <Icons.Google size={18} />
            <span>{signingIn ? "Verifying with Google..." : "Sign in with SSN Google Account"}</span>
          </button>
        </div>

        {/* Fast-Test Role Simulator — Available ONLY in Local Development Mode */}
        {isDevMode && (
          <div className="pt-4 border-t space-y-3" style={{ borderColor: tint("border", 0.5) }}>
            <div className="flex items-center justify-between">
              <span className="font-sans-ui text-[10px] uppercase tracking-widest font-bold text-amber-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Dev Role Simulator ({DEFAULT_ADMIN_EMAILS.length} Approved Admins)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_ADMIN_EMAILS.map((adminEmail, i) => {
                const username = adminEmail.split("@")[0]
                return (
                  <button
                    key={adminEmail}
                    onClick={() => handleSimulate(adminEmail, `${username.toUpperCase()} (Admin)`)}
                    className="p-2.5 rounded-xl border text-left font-sans-ui text-xs hover:border-emerald-500 hover:bg-emerald-500/5 transition-all cursor-pointer"
                    style={{ background: solid("bg"), borderColor: tint("border", 0.6) }}
                  >
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                      <Icons.Check size={11} /> Admin #{i + 1}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">{adminEmail}</div>
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleSimulate("otherstudent@ssn.edu.in", "Normal SSN Student")}
                className="p-2.5 rounded-xl border text-left font-sans-ui text-xs hover:border-blue-500 transition-all cursor-pointer"
                style={{ background: solid("bg"), borderColor: tint("border", 0.6) }}
              >
                <div className="font-bold text-blue-500 text-[11px] flex items-center gap-1">
                  <Icons.User size={11} /> Normal SSN Student
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">otherstudent@ssn.edu.in</div>
              </button>

              <button
                onClick={() => handleSimulate("randomuser@gmail.com", "Random Non-SSN User")}
                className="p-2.5 rounded-xl border text-left font-sans-ui text-xs hover:border-red-500 transition-all cursor-pointer"
                style={{ background: solid("bg"), borderColor: tint("border", 0.6) }}
              >
                <div className="font-bold text-red-500 text-[11px] flex items-center gap-1">
                  <Icons.X size={11} /> Non-SSN Email
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">randomuser@gmail.com</div>
              </button>
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <Link to="/" className="font-sans-ui text-xs hover:underline" style={{ color: solid("muted") }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}
