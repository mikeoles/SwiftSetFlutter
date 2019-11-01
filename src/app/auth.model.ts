import { Moment } from 'moment';

export default class AuthData {
  tokenType: string;
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Moment;
}
