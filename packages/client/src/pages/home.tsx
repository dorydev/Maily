import { useState } from "react"
import {Link} from "react-router-dom"
import { AppSidebar } from "../components/app-sidebar"
import { Topbar } from "../components/topbar"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Separator } from "../components/ui/separator"
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,} from "../components/dropdown-menu"
import { Plus, Send, Users, Mail } from "lucide-react"

// ─── Mock data ─────────────────────────────────────────────────────────────────

type ArchivesItem = {
  date: string
  subject: string
  content: string
}

const archivesRecipes: ArchivesItem[] = [
  { date: "01/01/26", subject: "Raclette Annuelle", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat." },
  { date: "02/01/26", subject: "Sieste saisonnière", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat." },
  { date: "03/01/26", subject: "Pause Cacafé", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat." },
  { date: "04/01/26", subject: "Réunion de 24h/j", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat." },
]



const WELCOME_MESSAGES = [
  "Happy to see you back"
]

const MOCK_STATS = {
  totalSent: 1284,
  campaigns: 12,
  recipients: 342,
}

// Stats
function StatCard({ label, value, Icon }: { label: string; value: number; Icon: typeof Send }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-accent/20 px-5 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

// Home
function Home() {
  const [search, setSearch] = useState("")

  const filtered = archivesRecipes.filter(
    (item) =>
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
  )

  const welcomeMessage = WELCOME_MESSAGES[0]


  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Topbar />
      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-6 py-6 space-y-8">

            {/* Welcome */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Welcome $name !</h1>
                <p className="text-sm text-muted-foreground mt-1">{welcomeMessage}</p>
              </div>
              <Link to={"/mail-editor"}>
              <Button className="gap-2">
                <Plus className="size-4" />
                Nouveau mail
              </Button></Link>
            </div>

            {/* Stats*/}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pb-5 pt-6">
              <StatCard label="Mails envoyés" value={MOCK_STATS.totalSent} Icon={Send} />
              <StatCard label="Campagnes" value={MOCK_STATS.campaigns} Icon={Mail} />
              <StatCard label="Destinataires" value={MOCK_STATS.recipients} Icon={Users} />
            </div>

            <Separator/>
            {/* Archives */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Archives</h2>
                  <p className="text-sm text-muted-foreground">{archivesRecipes.length} campagnes</p>
                </div>
                <div className="w-full max-w-xs">
                  <Input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map(({ date, subject, content }) => (
                  <div
                    key={`${date}-${subject}`}
                    className="group flex cursor-pointer flex-col gap-3 rounded-lg border bg-accent/20 p-4 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-muted/50 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold">{subject}</p>
                      <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="opacity-0 transition-opacity group-hover:opacity-100">•••</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                    <span className="text-xs text-muted-foreground">{date}</span>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{content}</p>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <p className="col-span-full text-center text-sm text-muted-foreground py-12">
                    Aucune archive trouvée pour "{search}"
                  </p>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default Home
