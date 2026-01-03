export interface JwtPayload {
  sub: number;
  email: string;
  exp?: number;
  iat?: number;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
}
