import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Edit,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDayOfWeek, getDaysInMonth } from "../utils/date";
import type { Employee } from "../types";

export default function MonthlyPlan() {
  const [isEdit, setIsEdit] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // 월 변경
  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const changeMode = () => {
    setIsEdit((prev) => !prev);
  };

  // 직원 목록 조회
  const loadEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await window.electronAPI.employees.getAll();

      if (result.success) {
        setEmployees(result.data || []);
      } else {
        setError(result.error || "직원 목록 조회 실패");
      }
    } catch (err) {
      setError("API 호출 실패: " + err);
    } finally {
      setLoading(false);
    }
  };

  console.log(employees);

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="space-y-6">
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

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="h-full overflow-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 sticky top-0 z-0">
              <tr>
                <th
                  rowSpan={2}
                  className="w-20 px-2 py-2 text-xs font-medium text-gray-500 border border-gray-300"
                >
                  체크
                </th>
                <th
                  rowSpan={2}
                  className="w-30 px-2 py-2 text-xs font-medium text-gray-500 border border-gray-300"
                >
                  성명
                </th>
                <th
                  rowSpan={2}
                  className="w-20 px-2 py-2 text-xs font-medium text-gray-500 border border-gray-300"
                >
                  휴휴
                </th>

                {/* 일자별 헤더 */}
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th
                    key={i + 1}
                    className="w-8 px-1 py-2 text-xs font-medium text-gray-500 border border-gray-300"
                  >
                    {i + 1}
                  </th>
                ))}
              </tr>
              <tr>
                {/* 일자별 요일 */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dayOfWeek = getDayOfWeek(
                    currentYear,
                    currentMonth,
                    i + 1
                  );
                  return (
                    <td
                      key={i + 1}
                      className={`px-1 py-1 text-xs text-center border border-gray-300 ${
                        dayOfWeek === "일"
                          ? "text-red-500"
                          : dayOfWeek === "토"
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      {dayOfWeek}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {employees?.map((e) => (
                <tr key={e.id}>
                  <td className="text-xs text-gray-500 border border-gray-300"></td>
                  <td className="text-xs  text-gray-500 border border-gray-300">
                    {e.name}
                  </td>
                  <td className="text-xs text-gray-500 border border-gray-300">
                    월화
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
