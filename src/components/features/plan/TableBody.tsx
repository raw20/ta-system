import { useMonthlyPlan } from "@/hooks/use-monthly-plan";

export default function TableBody() {
  const { employees } = useMonthlyPlan();
  return (
    <tbody>
      {employees?.map((e) => (
        <tr key={e.id}>
          <td className="text-xs text-gray-500 border border-gray-300"></td>
          <td className="text-xs  text-gray-500 border border-gray-300">
            {e.name}
          </td>
          <td className="text-xs text-gray-500 border border-gray-300">월화</td>
        </tr>
      ))}
    </tbody>
  );
}
