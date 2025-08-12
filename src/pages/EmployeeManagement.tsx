import { useState, useEffect, useMemo } from "react";
import { type Employee } from "../types/database";
import { NavLink, useNavigate } from "react-router-dom";
import { positions } from "../utils/employee";

type SortField = "emp_code" | "name" | "position" | "hire_date" | "status";
type SortOrder = "asc" | "desc";

const EmployeeManagement = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("emp_code");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const itemsPerPage = 5;

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

  const getPositionName = (code: string): string => {
    const position = positions.find((p) => p.code === code);
    return position?.name || "알수없음";
  };

  // 정렬된 직원 목록
  const sortedEmployees = useMemo(() => {
    const sorted = [...employees].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "emp_code":
          aValue = a.emp_code || "";
          bValue = b.emp_code || "";
          break;
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        case "position":
          aValue = getPositionName(a.position);
          bValue = getPositionName(b.position);
          break;
        case "hire_date":
          aValue = a.hire_date || "";
          bValue = b.hire_date || "";
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [employees, sortField, sortOrder]);

  // 현재 페이지 데이터
  const currentEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedEmployees.slice(startIndex, endIndex);
  }, [sortedEmployees, currentPage]);

  // 총 페이지 수
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // 정렬 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 정렬 아이콘 렌더링
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sortOrder === "asc" ? (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 이전 페이지 버튼
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          이전
        </button>
      );
    }

    // 첫 페이지
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span
            key="ellipsis1"
            className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300"
          >
            ...
          </span>
        );
      }
    }

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm border border-gray-300 ${
            i === currentPage
              ? "bg-blue-500 text-white"
              : "text-gray-700 bg-white hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // 마지막 페이지
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            key="ellipsis2"
            className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300"
          >
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          다음
        </button>
      );
    }

    return pages;
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-1 transition-colors"
          >
            사용자 추가
          </NavLink>
          <button
            onClick={loadEmployees}
            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
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
              <span className="text-gray-600">로딩 중...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 font-medium">오류: {error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                직원 목록 (총 {sortedEmployees.length}명)
              </h3>
              <div className="text-sm text-gray-500">
                {currentPage} / {totalPages} 페이지 (페이지당 {itemsPerPage}명)
              </div>
            </div>

            {sortedEmployees.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="mt-2 text-gray-500">등록된 직원이 없습니다.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th
                          className="py-3 px-4 text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("emp_code")}
                        >
                          <div className="flex justify-between space-x-1">
                            <span>사원번호</span>
                            {renderSortIcon("emp_code")}
                          </div>
                        </th>
                        <th
                          className="py-3 px-4 text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex justify-between space-x-1">
                            <span>이름</span>
                            {renderSortIcon("name")}
                          </div>
                        </th>
                        <th
                          className="py-3 px-4 text-left font-medium text-gray-700  hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("position")}
                        >
                          <div className="flex justify-between  space-x-1">
                            <span>직급</span>
                            {renderSortIcon("position")}
                          </div>
                        </th>
                        <th
                          className="py-3 px-4 text-left font-medium text-gray-700  hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("hire_date")}
                        >
                          <div className="flex justify-between space-x-1">
                            <span>입사일</span>
                            {renderSortIcon("hire_date")}
                          </div>
                        </th>
                        <th
                          className="py-3 px-4 text-left font-medium text-gray-700  hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex justify-between space-x-1">
                            <span>상태</span>
                            {renderSortIcon("status")}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmployees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="border-t hover:bg-gray-50  transition-colors"
                          onClick={() =>
                            navigate(`/employees/edit/${employee.id}`)
                          }
                        >
                          <td className="py-3 px-4">{employee.emp_code}</td>
                          <td className="py-3 px-4 font-medium">
                            {employee.name}
                          </td>
                          <td className="py-3 px-4">
                            {getPositionName(employee.position)}
                          </td>
                          <td className="py-3 px-4">{employee.hire_date}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6">
                    <nav
                      className="inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      {renderPagination()}
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
