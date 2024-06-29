import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogDirectoryComponent } from './dogdirectory.component';

describe('DogDirectoryComponent', () => {
  let component: DogDirectoryComponent;
  let fixture: ComponentFixture<DogDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogDirectoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
