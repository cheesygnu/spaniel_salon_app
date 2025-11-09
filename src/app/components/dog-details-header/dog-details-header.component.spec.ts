import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogDetailsHeaderComponent } from './dog-details-header.component';

describe('DogDetailsHeaderComponent', () => {
  let component: DogDetailsHeaderComponent;
  let fixture: ComponentFixture<DogDetailsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogDetailsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
