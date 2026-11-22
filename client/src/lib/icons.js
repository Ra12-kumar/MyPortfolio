import {
  Workflow, ClipboardList, Puzzle, Bot, Plug, ShieldCheck, Rocket, Globe, Layers, LayoutDashboard, Database,
  RefreshCw, Infinity as InfinityIcon, Briefcase, Sparkles, Settings2, MessagesSquare, Network, Headset,
  MessageSquareReply, Filter, CalendarCheck, FileSearch, BookOpen, LifeBuoy, Code2,
} from 'lucide-react';

const map = {
  Workflow, ClipboardList, Puzzle, Bot, Plug, ShieldCheck, Rocket, Globe, Layers, LayoutDashboard, Database,
  RefreshCw, Infinity: InfinityIcon, Briefcase, Sparkles, Settings2, MessagesSquare, Network, Headset,
  MessageSquareReply, Filter, CalendarCheck, FileSearch, BookOpen, LifeBuoy,
};

/** Resolves an icon by name (as stored in content/DB), with a safe default. */
export const getIcon = (name) => map[name] || Code2;
export const iconNames = Object.keys(map);
