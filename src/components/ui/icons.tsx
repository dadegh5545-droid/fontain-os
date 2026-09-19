import type { SVGProps } from "react";
import type { AppNavItem } from "@/components/layout/nav";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const InboxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 13l2.5-7h13L21 13v6H3z" />
    <path d="M3 13h5l1.5 3h5L16 13h5" />
  </Svg>
);
export const LeadsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16l-6 8v5l-4 2v-7z" />
  </Svg>
);
export const ClientsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0113 0" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M15.5 20a5 5 0 016-4.5" />
  </Svg>
);
export const TasksIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </Svg>
);
export const FinanceIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6.5 9.5h.01M17.5 14.5h.01" />
  </Svg>
);
export const SettingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
  </Svg>
);
export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const NAV_ICONS: Record<AppNavItem["key"], (p: IconProps) => React.JSX.Element> = {
  inbox: InboxIcon,
  leads: LeadsIcon,
  clients: ClientsIcon,
  tasks: TasksIcon,
  finance: FinanceIcon,
  settings: SettingsIcon,
};
