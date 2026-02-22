import { TestBed } from '@angular/core/testing';

import { SelectedDog } from './selected-dog';

describe('SelectedDog', () => {
  let service: SelectedDog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedDog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
