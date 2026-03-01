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

export type RestCountryCurrencyResponse = {
  currencies?: Record<string, { name?: string; symbol?: string }>;
};
