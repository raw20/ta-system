import { useState, useEffect } from "react";
import { type Employee } from "../types/database";
import { NavLink } from "react-router-dom";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const positions = (code: string) => {
    switch (code) {
      case "PTL":
        return "파트장";
      case "SNR":
        return "선임";
      case "TLD":
        return "조장";
      case "REG":
        return "정규사원";
      case "PRT":
        return "단시간사원";
      default:
        return "알수없음";
    }
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

  // 컴포넌트 마운트 시 직원 목록 로드
  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">직원 관리</h2>
        <div className="flex justify-between">
          <NavLink
            to="/employees/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-1 cursor-pointer"
          >
            사용자 추가
          </NavLink>
          <button
            onClick={loadEmployees}
            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 cursor-pointer"
          >
            새로고침
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {loading && <p className="text-blue-600">로딩 중...</p>}

        {error && <p className="text-red-600">오류: {error}</p>}

        {!loading && !error && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              직원 목록 ({employees.length}명)
            </h3>

            {employees.length === 0 ? (
              <p className="text-gray-500">등록된 직원이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 ">
                      <th className="py-2">사원번호</th>
                      <th className="py-2">이름</th>
                      <th className="py-2">직급</th>
                      <th className="py-2">입사일</th>
                      <th className="py-2">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="border-t">
                        <td className="py-2">{employee.emp_code}</td>
                        <td className="py-2">{employee.name}</td>
                        <td className="py-2">{positions(employee.position)}</td>
                        <td className="py-2">{employee.hire_date}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              employee.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {employee.status === "active" ? "재직" : "퇴사"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
