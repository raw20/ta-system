import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

export default function Table({ daysInMonth }: { daysInMonth: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="h-full overflow-auto">
        <table className="min-w-full bg-white">
          <TableHeader daysInMonth={daysInMonth} />
          <TableBody />
        </table>
      </div>
    </div>
  );
}
