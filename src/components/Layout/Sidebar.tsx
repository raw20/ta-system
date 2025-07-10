import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  MoonIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "대시보드", href: "/", icon: HomeIcon },
  { name: "직원 관리", href: "/employees", icon: UserGroupIcon },
  { name: "월 근무 계획", href: "/monthly-plan", icon: CalendarDaysIcon },
  {
    name: "근무편성표",
    href: "/work-schedule",
    icon: ClipboardDocumentListIcon,
  },
  { name: "야간시간", href: "/night-hours", icon: MoonIcon },
  { name: "월 출근부", href: "/monthly-attendance", icon: DocumentTextIcon },
  { name: "월간 근무계획표", href: "/monthly-schedules", icon: TableCellsIcon },
  { name: "연차현황", href: "/annual-leave", icon: ClockIcon },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* 로고 영역 */}
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <span className="text-white text-lg font-semibold">TA System</span>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 px-4 py-6 space-y-2 bg-amber-100">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
