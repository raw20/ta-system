import { useMonthlyPlan } from "@/hooks/use-monthly-plan";
import { getDayOfWeek } from "@/utils/date";

export default function TableHeader({ daysInMonth }: { daysInMonth: number }) {
  const { currentYear, currentMonth } = useMonthlyPlan();
  return (
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
          const dayOfWeek = getDayOfWeek(currentYear, currentMonth, i + 1);
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
  );
}
