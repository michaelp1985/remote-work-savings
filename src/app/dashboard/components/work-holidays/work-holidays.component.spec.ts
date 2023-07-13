import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHolidaysComponent } from './work-holidays.component';

describe('WorkHolidaysComponent', () => {
  let component: WorkHolidaysComponent;
  let fixture: ComponentFixture<WorkHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkHolidaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
