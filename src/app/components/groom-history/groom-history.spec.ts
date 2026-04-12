import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroomHistory } from './groom-history';

describe('GroomHistory', () => {
  let component: GroomHistory;
  let fixture: ComponentFixture<GroomHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroomHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroomHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
