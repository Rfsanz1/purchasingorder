export interface UserPayload {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  permissions: string[];
}

export interface DashboardSummary {
  users: number;
  roles: number;
  notifications: number;
  permissions: number;
}

export interface NotificationItem {
  id: string;
  recipient: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
  readAt?: string | null;
}
