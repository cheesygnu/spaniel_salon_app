import { TestBed } from '@angular/core/testing';

import { myAuthService } from './auth.service';

describe('AuthService', () => {
  let service: myAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(myAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
