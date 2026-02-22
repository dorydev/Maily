import { useState, useRef } from "react"
import { X, Camera, Plus, Trash2, Star, Check } from "lucide-react"


type ConnectedAccount = {
  id: string
  email: string
  provider: "google" | "outlook" | "smtp"
  isDefault: boolean
}


const MOCK_ACCOUNTS: ConnectedAccount[] = [
  { id: "1", email: "john.doe@gmail.com", provider: "google", isDefault: true },
  { id: "2", email: "john.doe@outlook.com", provider: "outlook", isDefault: false },
  { id: "3", email: "contact@mydomain.com", provider: "smtp", isDefault: false },
]

const PROVIDER_COLORS: Record<ConnectedAccount["provider"], string> = {
  google: "#EA4335",
  outlook: "#0078D4",
  smtp: "#6B7280",
}

const PROVIDER_LABELS: Record<ConnectedAccount["provider"], string> = {
  google: "Google",
  outlook: "Outlook",
  smtp: "SMTP",
}


function Avatar({ initials, src, size = 80 }: { initials: string; src?: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center text-blue-400 font-semibold overflow-hidden shrink-0"
    >
      {src ? (
        <img src={src} alt="profile" className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: size * 0.3 }}>{initials}</span>
      )}
    </div>
  )
}

function ProviderDot({ provider }: { provider: ConnectedAccount["provider"] }) {
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
      style={{
        backgroundColor: PROVIDER_COLORS[provider] + "22",
        color: PROVIDER_COLORS[provider],
        border: `1px solid ${PROVIDER_COLORS[provider]}44`,
      }}
    >
      {PROVIDER_LABELS[provider]}
    </span>
  )
}

export function UserProfileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Doe")
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>()
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(MOCK_ACCOUNTS)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarSrc(url)
  }

  const setDefault = (id: string) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-bac/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 z-50 h-full w-[400px] flex flex-col bg-background border-l border-border shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Profile Settings</p>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-lg text-foreground/40 hover:text-foreground hover:bg-white/8 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* Avatar section */}
          <section className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground/30">Profile Picture</p>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar initials={initials} src={avatarSrc} size={72} />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 size-7 rounded-full bg-blue-500 flex items-center justify-center shadow-lg hover:bg-blue-400 transition-colors"
                >
                  <Camera className="size-3.5 text-foreground" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{firstName} {lastName}</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Change photo
                </button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/6" />

          {/* Identity section */}
          <section className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground/30">Identity</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-foreground/40">First name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-9 rounded-lg bg-input border border-border px-3 text-sm text-muted-foreground placeholder:text-foreground/20 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-foreground/40">Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-9 rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/6" />

          {/* Connected accounts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-foreground/30">Accounts</p>
              <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <Plus className="size-3" />
                Add
              </button>
            </div>

            <div className="space-y-2">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    account.isDefault
                      ? "bg-blue-500/8 border-blue-500/25"
                      : "bg-white/4 border-white/6 hover:border-white/12"
                  }`}
                >
                  {/* Avatar mini */}
                  <div className="size-8 rounded-full bg-white/8 flex items-center justify-center text-xs font-semibold text-foreground/60 shrink-0">
                    {account.email[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-sm text-foreground truncate">{account.email}</p>
                    <ProviderDot provider={account.provider} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {account.isDefault ? (
                      <span className="flex items-center gap-1 text-[10px] text-blue-400 font-medium">
                        <Star className="size-3 fill-blue-400" />
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefault(account.id)}
                        className="size-7 flex items-center justify-center rounded-lg text-foreground/25 hover:text-foreground/60 hover:bg-white/8 transition-colors"
                        title="Define by default"
                      >
                        <Star className="size-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => removeAccount(account.id)}
                      className="size-7 flex items-center justify-center rounded-lg text-foreground/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <button
            onClick={handleSave}
            className={`w-full h-10 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-blue-500 hover:bg-blue-400 text-foreground shadow-lg shadow-blue-500/20"
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="size-4" /> Saved
              </span>
            ) : (
              "Save ?"
            )}
          </button>
        </div>
      </div>
    </>
  )
}
