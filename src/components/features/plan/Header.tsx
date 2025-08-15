import { useMonthlyPlan } from "@/hooks/use-monthly-plan";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
} from "lucide-react";

export default function Header() {
  const { isEdit, currentYear, currentMonth, setIsEdit, changeMonth } =
    useMonthlyPlan();

  const changeMode = () => {
    setIsEdit((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-end">
      <h2 className="text-3xl font-bold text-gray-900">월 근무 계획</h2>

      {/* 월 선택 */}
      <div className="flex items-center space-x-2">
        <button
          className="p-1 rounded hover:bg-gray"
          onClick={() => changeMonth(-1)}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">
            {currentYear}년 {currentMonth}월
          </span>
        </div>
        <button
          className="p-1 rounded hover:bg-gray"
          onClick={() => changeMonth(1)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={changeMode}
        >
          {isEdit ? (
            <>
              <Edit className="w-4 h-4 mr-2" />
              수정모드
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              읽기모드
            </>
          )}
        </button>
        <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          엑셀 다운로드
        </button>
      </div>
    </div>
  );
}
