export type Account = "bbva" | "amex" | "nu";

export interface Transaction {
  id: number;
  name: string;
  date: string;
  amount: number;
  account: Account;
  cat: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextDate: string;
  account: string;
  color: string;
  bgColor: string;
  borderColor: string;
  initials: string;
  warning?: string;
}

export interface Alert {
  id: string;
  type: "danger" | "warn" | "info";
  title: string;
  desc: string;
  date: string;
}

export interface CategoryRule {
  emoji: string;
  color: string;
}
