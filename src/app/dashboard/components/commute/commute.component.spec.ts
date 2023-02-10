import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuelCostService } from 'src/app/services/fuel-cost.service';

import { CommuteComponent } from './commute.component';

describe('CommuteComponent', () => {
  let component: CommuteComponent;
  let fixture: ComponentFixture<CommuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommuteComponent ],
      providers: [FuelCostService, HttpClient, HttpHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get fuel Data', () => {
    let results = component.getFuelDataByRegion("R30");

    console.log(results);
  })
});
