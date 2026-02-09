import { AppSidebar } from "../components/app-sidebar"
import { Topbar } from "../components/topbar"
import { Input } from "../components/ui/input"

type ArchivesItem = {
  date: string
  subject: string
  content: string
}

const archivesRecipes: ArchivesItem[] = [
  { date: "01/01/26", subject: "Raclette Annuelle", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos." },
  { date: "02/01/26", subject: "Sieste saisonnière", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos." },
  { date: "03/01/26", subject: "Pause Cacafé", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos." },
  { date: "04/01/26", subject: "Réunion de 24h/j", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos." },
]

function Archives() {
  return (
      <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Topbar/>
      <div className="flex min-h-0 flex-1">
        <AppSidebar/>
        <main className="min-w-0 flex-1 w-full">
          <section>
            <div className="mx-auto w-full max-w-6xl px-6 py-4">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">Archives</h1>
                  <p className="text-sm text-muted-foreground">{archivesRecipes.length} archives</p>
                </div>
                <div className="w-full sm:max-w-sm">
                  <Input placeholder="Find archive" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {archivesRecipes.map(({ date, subject, content }) => (
                <div
                  key={`${date}-${subject}`}
                  className="group flex cursor-pointer flex-col gap-3 rounded-lg border bg-accent/20 p-4 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-muted/50 hover:shadow-md"
                >
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold">{subject}</p>
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">•••</span>
                </div>
                  <span className="text-xs text-muted-foreground">{date}</span>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{content}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Archives
