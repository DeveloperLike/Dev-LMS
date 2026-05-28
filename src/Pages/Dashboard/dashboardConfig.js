import { FaCity, FaUserFriends } from "react-icons/fa";
import { AiFillContainer } from "react-icons/ai";

import {
  MdOutlineSchedule,
  MdOutlineMarkEmailUnread,
  MdOutlinePendingActions,
  MdOutlineTrendingUp,
} from "react-icons/md";

import { HiPhoneMissedCall } from "react-icons/hi";

import { RiChatFollowUpLine } from "react-icons/ri";

import { HiOutlineInboxStack } from "react-icons/hi2";

import { BsBank2 } from "react-icons/bs";

import { GoPackage } from "react-icons/go";

export const dashboardConfig = [
  {
    key: "state",
    label: "State",
    icon: FaCity,
    route: "/state",

    lightColor:
      "text-emerald-950 bg-gradient-to-br from-[#c8f0da] via-[#dcf7e7] to-[#bdeacb] border border-emerald-300 shadow-md shadow-emerald-200/50",

    darkColor:
      "text-green-400 bg-gradient-to-br from-green-950/60 via-emerald-900/40 to-lime-900/30 border border-green-800/40",
  },

  {
    key: "lead",
    label: "Lead",
    icon: AiFillContainer,
    route: "/lead",

    lightColor:
      "text-indigo-950 bg-gradient-to-br from-[#d5ddff] via-[#e7ecff] to-[#cad6ff] border border-indigo-300 shadow-md shadow-indigo-200/50",

    darkColor:
      "text-blue-400 bg-gradient-to-br from-blue-950/60 via-indigo-900/40 to-cyan-900/30 border border-blue-800/40",
  },

  {
    key: "unassigned leads",
    label: "Unassigned Leads",
    icon: MdOutlinePendingActions,
    route: "/unassigned-lead",

    lightColor:
      "text-violet-950 bg-gradient-to-br from-[#e6d5ff] via-[#f0e6ff] to-[#dcc6ff] border border-violet-300 shadow-md shadow-violet-200/50",

    darkColor:
      "text-violet-400 bg-gradient-to-br from-violet-950/60 via-purple-900/40 to-fuchsia-900/30 border border-violet-800/40",
  },

  {
    key: "fresh lead",
    label: "Fresh Lead",
    icon: MdOutlineMarkEmailUnread,
    dynamicRoute: "fresh",

    lightColor:
      "text-sky-950 bg-gradient-to-br from-[#cfeeff] via-[#e4f7ff] to-[#c3e8ff] border border-sky-300 shadow-md shadow-sky-200/50",

    darkColor:
      "text-sky-400 bg-gradient-to-br from-sky-950/60 via-blue-900/40 to-cyan-900/30 border border-sky-800/40",
  },

  {
    key: "future lead",
    label: "Future Lead",
    icon: MdOutlineSchedule,
    route: "/lead-filter/c8704f97-f12c-47f7-81db-e82b6069ee2f",

    lightColor:
      "text-purple-950 bg-gradient-to-br from-[#e7d2ff] via-[#f1e3ff] to-[#dcc0ff] border border-purple-300 shadow-md shadow-purple-200/50",

    darkColor:
      "text-purple-400 bg-gradient-to-br from-purple-950/60 via-violet-900/40 to-fuchsia-900/30 border border-purple-800/40",
  },

  {
    key: "did not pick",
    label: "Did Not Pick",
    icon: HiPhoneMissedCall,
    route: "/lead-filter/4b3428a2-18f5-47ec-a842-ae732ac7c9cb",

    lightColor:
      "text-slate-950 bg-gradient-to-br from-[#dde3ea] via-[#eef2f6] to-[#d4dae3] border border-slate-300 shadow-md shadow-slate-200/50",

    darkColor:
      "text-slate-300 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-700/40 border border-slate-700/50",
  },

  {
    key: "Backlog",
    label: "Backlog",
    icon: HiOutlineInboxStack,
    route: "/follow-up",
    state: { resetDate: "EMPTY" },

    lightColor:
      "text-rose-950 bg-gradient-to-br from-[#ffd6d6] via-[#ffe9e9] to-[#ffcaca] border border-rose-300 shadow-md shadow-rose-200/50",

    darkColor:
      "text-red-400 bg-gradient-to-br from-red-950/60 via-rose-900/40 to-orange-900/30 border border-red-800/40",
  },

  {
    key: "FollowUp",
    label: "FollowUp",
    icon: RiChatFollowUpLine,
    route: "/follow-up",

    lightColor:
      "text-pink-950 bg-gradient-to-br from-[#ffd9ea] via-[#ffebf4] to-[#ffcfe4] border border-pink-300 shadow-md shadow-pink-200/50",

    darkColor:
      "text-pink-400 bg-gradient-to-br from-pink-950/60 via-rose-900/40 to-fuchsia-900/30 border border-pink-800/40",
  },

  {
    key: "branch",
    label: "Branch",
    icon: BsBank2,
    route: "/branch",

    lightColor:
      "text-amber-950 bg-gradient-to-br from-[#ffe7c7] via-[#fff2de] to-[#ffdcae] border border-amber-300 shadow-md shadow-amber-200/50",

    darkColor:
      "text-stone-300 bg-gradient-to-br from-stone-900/80 via-orange-900/30 to-amber-900/20 border border-stone-700/40",
  },

  {
    key: "package",
    label: "Package",
    icon: GoPackage,
    route: "/package",

    lightColor:
      "text-orange-950 bg-gradient-to-br from-[#ffe0c7] via-[#fff0e1] to-[#ffd3b0] border border-orange-300 shadow-md shadow-orange-200/50",

    darkColor:
      "text-orange-400 bg-gradient-to-br from-orange-950/60 via-amber-900/40 to-yellow-900/30 border border-orange-800/40",
  },

  {
    key: "active users",
    label: "Active Users",
    icon: FaUserFriends,
    route: "/users",

    lightColor:
      "text-yellow-950 bg-gradient-to-br from-[#fff0b8] via-[#fff7d9] to-[#ffe89d] border border-yellow-300 shadow-md shadow-yellow-200/50",

    darkColor:
      "text-yellow-400 bg-gradient-to-br from-yellow-950/60 via-amber-900/40 to-orange-900/30 border border-yellow-800/40",
  },

  {
    key: "sales",
    label: "Sales",
    icon: MdOutlineTrendingUp,
    route: "/sales",

    lightColor:
      "text-teal-950 bg-gradient-to-br from-[#c8f3ea] via-[#defaf4] to-[#bcebdd] border border-teal-300 shadow-md shadow-teal-200/50",

    darkColor:
      "text-teal-400 bg-gradient-to-br from-teal-950/60 via-cyan-900/40 to-emerald-900/30 border border-teal-800/40",
  },
];
