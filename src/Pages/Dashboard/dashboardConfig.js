import { GiModernCity } from "react-icons/gi";
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
  // {
  //   key: "city",
  //   label: "City",
  //   color: "bg-green-600",
  //   icon: GiModernCity,
  //   route: "/city",
  // },
  {
    key: "state",
    label: "State",
    color: "bg-green-500",
    icon: FaCity,
    route: "/state",
  },
  {
    key: "lead",
    label: "Lead",
    color: "bg-blue-600",
    icon: AiFillContainer,
    route: "/lead",
  },
  {
    key: "unassigned leads",
    label: "Unassigned Leads",
    color: "bg-slate-700",
    icon: MdOutlinePendingActions,
    route: "/unassigned-lead",
  },
  {
    key: "fresh lead",
    label: "Fresh Lead",
    color: "bg-blue-500",
    icon: MdOutlineMarkEmailUnread,
    dynamicRoute: "fresh",
  },
  {
    key: "future lead",
    label: "Future Lead",
    color: "bg-blue-400",
    icon: MdOutlineSchedule,
    route: "/lead-filter/c8704f97-f12c-47f7-81db-e82b6069ee2f",
  },
  {
    key: "did not pick",
    label: "Did Not Pick",
    color: "bg-gray-600",
    icon: HiPhoneMissedCall,
    route: "/lead-filter/4b3428a2-18f5-47ec-a842-ae732ac7c9cb",
  },
  {
    key: "Backlog",
    label: "Backlog",
    color: "bg-red-700",
    icon: HiOutlineInboxStack,
    route: "/follow-up",
    state: { resetDate: "EMPTY" },
  },
  {
    key: "FollowUp",
    label: "FollowUp",
    color: "bg-red-500",
    icon: RiChatFollowUpLine,
    route: "/follow-up",
  },
  {
    key: "branch",
    label: "Branch",
    color: "bg-stone-500",
    icon: BsBank2,
    route: "/branch",
  },
  {
    key: "package",
    label: "Package",
    color: "bg-orange-500",
    icon: GoPackage,
    route: "/package",
  },
  {
    key: "active users",
    label: "Active Users",
    color: "bg-yellow-600",
    icon: FaUserFriends,
    route: "/users",
  },
  {
    key: "sales",
    label: "Sales",
    color: "bg-teal-600",
    icon: MdOutlineTrendingUp,
    route: "/sales",
  },
];
