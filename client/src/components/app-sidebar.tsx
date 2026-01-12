import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"

import { UsersIcon } from "../components/animate-ui/icons/users"
import { ExternalLinkIcon } from "../components/animate-ui/icons/external-link"
import { MessageSquareDashedIcon } from "../components/animate-ui/icons/message-square-dashed"

const mainNav = [
  { title: "Campaigns", to: "/home", Icon: UsersIcon, badge: "3" },
  { title: "Templates", to: "/templates", Icon: MessageSquareDashedIcon },
  { title: "Analytics", to: "/analytics", Icon: ExternalLinkIcon },
]

const settingsNav = [
  { title: "Settings", to: "/settings", Icon: ExternalLinkIcon },
  { title: "API Config", to: "/api", Icon: MessageSquareDashedIcon },
]

/**
 * Fixed (non-expandable) side rail.
 * - Always icon-only.
 * - No collapse/expand behavior.
 */
export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar
      // Some sidebar versions type this as "icon" | "offcanvas" | "none".
      // Using `as any` keeps it compatible if your local typings differ.
      collapsible={"none" as any}
      className="w-[72px] min-w-[72px] max-w-[72px] border-r"
    >
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-center">
          <div
            className="flex size-10 items-center justify-center rounded-xl bg-sidebar-accent text-foreground"
            title="Maily"
            aria-label="Maily"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(({ title, to, Icon, badge }) => {
                const active = pathname === to

                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-11 justify-center px-0"
                    >
                      <Link
                        to={to}
                        title={title}
                        aria-label={title}
                        className="relative flex w-full items-center justify-center"
                      >
                        <Icon size={18} />
                        {badge && (
                          <Badge
                            variant="secondary"
                            className="absolute -right-1 -top-1 h-4 min-w-4 justify-center rounded-full px-1 py-0 text-[10px] leading-none"
                          >
                            {badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNav.map(({ title, to, Icon }) => {
                const active = pathname === to

                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-11 justify-center px-0"
                    >
                      <Link
                        to={to}
                        title={title}
                        aria-label={title}
                        className="flex w-full items-center justify-center"
                      >
                        <Icon size={18} />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className="flex items-center justify-center">
          <div
            className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-chart-1 to-chart-2 text-sm font-semibold text-white"
            title="John Doe • john.doe@mail.com"
            aria-label="John Doe"
          >
            JD
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
