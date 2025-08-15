import { getDaysInMonth } from "../utils/date";
import Table from "../components/features/plan/Table";
import Header from "@/components/features/plan/Header";
import { useMonthlyPlan } from "@/hooks/use-monthly-plan";

export default function MonthlyPlan() {
  const { currentYear, currentMonth } = useMonthlyPlan();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  return (
    <div className="space-y-6">
      <Header />
      <Table daysInMonth={daysInMonth} />
    </div>
  );
}
