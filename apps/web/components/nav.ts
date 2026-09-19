import type { ComponentType, SVGProps } from "react";
import {
  BoltIcon,
  BookIcon,
  ChartIcon,
  ChatIcon,
  HomeIcon,
  RefreshIcon,
  UserIcon,
} from "./icons";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  description: string;
};

/** Primary navigation shown in the sidebar. */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
    description: "Your dashboard",
  },
  {
    label: "Practice Test",
    href: "/practice",
    icon: BoltIcon,
    description: "Full-length adaptive test",
  },
  {
    label: "Study Session",
    href: "/study",
    icon: ChatIcon,
    description: "Chat with your AI tutor",
  },
  {
    label: "Vocab",
    href: "/vocab",
    icon: BookIcon,
    description: "SAT word flashcards",
  },
  {
    label: "Review Quizzes",
    href: "/review",
    icon: RefreshIcon,
    description: "Revisit missed questions",
  },
  {
    label: "Stats",
    href: "/stats",
    icon: ChartIcon,
    description: "Progress & analytics",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserIcon,
    description: "Account & settings",
  },
];
