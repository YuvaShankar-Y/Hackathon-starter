import type { ApiResponse } from "./api";

/** Mirror backend/app/schemas/user.py */

export interface UserRead {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export type UserResponse = ApiResponse<UserRead>;
