import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu.tsx";
import { Badge } from "@/components/ui/badge.tsx";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <img
              src="/logo.svg"
              width="24"
              height="24"
              alt="duyet.net logo"
              className="h-6 w-6"
            />
            <span className="hidden font-bold sm:inline-block">
              duyet.net
            </span>
          </a>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/blog">
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/cv">
                  Resume
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/stats">
                  Analytics
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/mini">
                  Mini PC
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/live">
                  Live
                  <Badge variant="secondary" className="ml-2 h-5 text-xs">
                    New
                  </Badge>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <a
              className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
              href="/ls"
            >
              <span className="hidden lg:inline-flex">All links...</span>
              <span className="inline-flex lg:hidden">Links...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
