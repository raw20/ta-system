interface EmployeeValidationData {
  empCode: string;
  name: string;
  position: string;
  role: string;
  hireDate: string;
}

export const positions = [
  { id: 1, code: "PTL", name: "파트장" },
  { id: 2, code: "SNR", name: "선임" },
  { id: 3, code: "TLD", name: "조장" },
  { id: 4, code: "REG", name: "정규사원" },
  { id: 5, code: "PRT", name: "단시간사원" },
];

export const roles = [
  { id: 1, code: "M", name: "관리자" },
  { id: 2, code: "C", name: "카트" },
  { id: 3, code: "P", name: "주차" },
];

export const validateForm = (data: EmployeeValidationData): string => {
  const { empCode, name, position, role, hireDate } = data;

  if (!empCode.trim()) {
    return "사번을 입력해주세요.";
  }
  if (!name.trim()) {
    return "이름을 입력해주세요.";
  }
  if (!position || position === "-") {
    return "직급을 선택해주세요.";
  }

  if (!role || role === "-") {
    return "역할을 선택해주세요.";
  }
  if (!hireDate) {
    return "입사일을 입력해주세요.";
  }

  // 사번 형식 검사 (예: 숫자만 허용하거나 특정 패턴)
  if (!/^[A-Za-z0-9]+$/.test(empCode)) {
    return "사번은 영문자와 숫자만 입력 가능합니다.";
  }

  // 이름 길이 검사
  if (name.trim().length < 2) {
    return "이름은 2글자 이상 입력해주세요.";
  }

  return "";
};
