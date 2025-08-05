import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { Employee } from "../types";
import { positions, validateForm } from "../utils/employee";

export default function EmployeeAdd() {
  const navigate = useNavigate();

  const [empCode, setEmpCode] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState<
    "PTL" | "SNR" | "TLD" | "REG" | "PRT"
  >("REG");
  const [hireDate, setHireDate] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    const validationError = validateForm({
      empCode,
      name,
      position,
      hireDate,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const employeeData: Employee = {
        emp_code: empCode.trim(),
        name: name.trim(),
        position: position,
        hire_date: hireDate,
      };

      const result = await window.electronAPI.employees.create(employeeData);

      if (result.success) {
        // 성공 시 직원 목록 페이지로 이동
        alert("직원이 성공적으로 추가되었습니다.");
        navigate("/employees");
      } else {
        // API에서 반환한 에러 메시지 처리
        const errorMessage = result.error || "직원 추가에 실패했습니다.";

        // 중복 사번 에러 특별 처리
        if (
          errorMessage.includes("UNIQUE constraint failed") ||
          errorMessage.includes("중복") ||
          errorMessage.includes("duplicate") ||
          errorMessage.toLowerCase().includes("emp_code")
        ) {
          setError("이미 존재하는 사번입니다. 다른 사번을 입력해주세요.");
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error("직원 추가 실패:", err);
      if (err instanceof Error) {
        setError(`직원 추가 실패: ${err.message}`);
      } else {
        setError("직원 추가 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 초기화
  const handleReset = () => {
    setEmpCode("");
    setName("");
    setPosition("REG");
    setHireDate("");
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold text-gray-900">신규 사용자 추가</h2>
        <div className="flex justify-between">
          <NavLink
            to="/employees"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-1 cursor-pointer transition-colors"
          >
            뒤로가기
          </NavLink>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center flex-col">
          {/* 에러 메시지 영역 */}
          {error && (
            <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="space-y-4">
              <div className="flex items-center space-x-6">
                <label
                  htmlFor="emp_code"
                  className="w-16 text-sm font-medium text-gray-700"
                >
                  사번
                </label>
                <input
                  type="text"
                  name="emp_code"
                  id="emp_code"
                  value={empCode}
                  onChange={(e) => setEmpCode(e.target.value)}
                  placeholder="사번을 입력하세요"
                  className="flex-1 h-9 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-3"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-6">
                <label
                  htmlFor="name"
                  className="w-16 text-sm font-medium text-gray-700"
                >
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="flex-1 h-9 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-3"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-6">
                <label
                  htmlFor="position"
                  className="w-16 text-sm font-medium text-gray-700"
                >
                  직급
                </label>
                <select
                  name="position"
                  id="position"
                  value={position}
                  onChange={(e) =>
                    setPosition(
                      e.target.value as "PTL" | "SNR" | "TLD" | "REG" | "PRT"
                    )
                  }
                  className="flex-1 h-9 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-3"
                  disabled={isLoading}
                >
                  <option value="">선택해주세요</option>
                  {positions?.map((p) => (
                    <option key={p.id} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-6">
                <label
                  htmlFor="hire_date"
                  className="w-16 text-sm font-medium text-gray-700"
                >
                  입사일
                </label>
                <input
                  type="date"
                  name="hire_date"
                  id="hire_date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  className="flex-1 h-9 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-3"
                  disabled={isLoading}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  } text-white`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      저장 중...
                    </div>
                  ) : (
                    "저장"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  초기화
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
