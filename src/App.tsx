import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [dbStatus, setDbStatus] = useState<string>("테스트 안함");
  const [employees, setEmployees] = useState<any[]>([]);

  // 🧪 데이터베이스 연결 테스트
  const testDatabase = async () => {
    try {
      setDbStatus("테스트 중...");
      const result = await (window as any).electronAPI.testDbConnection();

      if (result.success) {
        setDbStatus(`✅ 연결 성공! 직원 수: ${result.count}명`);
        setEmployees(result.employees);
      } else {
        setDbStatus(`❌ 연결 실패: ${result.error}`);
      }
    } catch (error) {
      setDbStatus(`❌ 에러: ${error}`);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>근태관리 시스템</h1>

      {/* 🧪 데이터베이스 테스트 섹션 */}
      <div className="card">
        <h2>데이터베이스 테스트</h2>
        <button
          onClick={testDatabase}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          DB 연결 테스트
        </button>
        <p className="mt-2">상태: {dbStatus}</p>

        {employees.length > 0 && (
          <div className="mt-4">
            <h3>직원 목록:</h3>
            <ul className="text-left">
              {employees.map((emp, index) => (
                <li key={index}>
                  {emp.name} ({emp.position}) - {emp.emp_code}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <div className="bg-blue-500 text-white p-4">Tailwind 잘 작동합니다!</div>
    </>
  );
}

export default App;
