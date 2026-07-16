export type AuthResponse = {
  id: number;
  email: string;
  token: string;
};

export type AuthErrorResponse = {
  error: string;
  message: string;
};
