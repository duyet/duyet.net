import { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "@/libs/utils.ts";

const NavigationMenu = forwardRef<HTMLElement, JSX.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  ),
);
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = forwardRef<
  HTMLUListElement,
  JSX.HTMLAttributes<HTMLUListElement>
>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        className,
      )}
      {...props}
    />
  ),
);
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = forwardRef<
  HTMLLIElement,
  JSX.HTMLAttributes<HTMLLIElement>
>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  ),
);
NavigationMenuItem.displayName = "NavigationMenuItem";

const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  JSX.HTMLAttributes<HTMLAnchorElement>
>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
NavigationMenuLink.displayName = "NavigationMenuLink";

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
};
