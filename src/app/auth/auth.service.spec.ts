import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import AuthData from '../models/auth.model';
import moment from 'moment';
import { Role } from './role';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should set roles', () => {
    const authData = createAuthData();
    localStorage.setItem('authData', JSON.stringify(authData));

    const service: AuthService = TestBed.get(AuthService);

    expect(service.hasRole(Role.CUSTOMER)).toBeTruthy();
    expect(service.hasRole(Role.BOSSANOVA)).toBeTruthy();
    expect(service.hasRole(Role.PANO_EXPORT)).toBeFalsy();
  });
});

function createAuthData(): AuthData {
  return {
    tokenType: 'bearer',
    expiresAt: moment(),
    accessToken: 'access-token',
    refreshToken: 'refrehs-token',
    idToken: 'idToken',
    roles: [Role.BOSSANOVA, Role.CUSTOMER]
  };
}
