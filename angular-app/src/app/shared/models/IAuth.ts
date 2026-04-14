export interface IAuth {
  accessToken: string;
  refreshToken?: string;
  authenticated: boolean;
  created: string;
  expiration: string;
}
