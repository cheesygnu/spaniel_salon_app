import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSwitchmapComponent } from './client-switchmap.component';

describe('ClientSwitchmapComponent', () => {
  let component: ClientSwitchmapComponent;
  let fixture: ComponentFixture<ClientSwitchmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSwitchmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSwitchmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
