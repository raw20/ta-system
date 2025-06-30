export * from "./database";

// 일반적인 타입들
export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn {
  key: string;
  title: string;
  width?: string;
}
