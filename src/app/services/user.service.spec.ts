import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FuelCostService } from './fuel-cost.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { TimeSavingsService } from './time-savings.service';
import { time } from 'console';

describe('UserService', () => {
  let service: UserService;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  const fuelCostServiceSpy = jasmine.createSpyObj('FuelCostService', [
    'loadFuelData',
    'getFuelDataByFuelType',
    'fuelData$',
  ]);

  const timeSavingsServiceSpy = jasmine.createSpyObj('TimeSavingsService', [
    'getTotalRemoteWorkWeeks',
    'getTotalRemoteWorkingDays'
  ]);


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientSpy,
        },
        {
          provide: FuelCostService,
          useValue: fuelCostServiceSpy,
        },
        {
          provide: TimeSavingsService,
          useValue: timeSavingsServiceSpy,
        },
      ],
    });

    fuelCostServiceSpy.fuelData = jasmine.createSpyObj('fuelData$', [
      'subscribe',
    ]);
    service = TestBed.inject(UserService);
    service.clearUserCache();
  });

  describe('Verify Service', () => {
    it('User Service should be defined', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('populateFuelData', () => {
    it('should populate fuel data', () => {
      const fuelData = {
        fuelType: 'Gasoline',
        fuelCostPerGallon: 2.5,
      };

      const user = {
        state: {
          name: 'Alabama',
          abbreviation: 'AL',
          area: '52420',
        },
        remoteWorkHistory: {
          startDate: new Date(2020, 0, 1),
          endDate: new Date(2021, 0, 1),
          remoteWorkDaysPerWeek: 5,
          holidayCountPerYear: 6,
        },
      };

      service.user.state = user.state;
      service.user.remoteWorkHistory = user.remoteWorkHistory;

      fuelCostServiceSpy.fuelData$.and.returnValue(
        new Observable((subscriber) => {
          subscriber.next(fuelData);
          subscriber.complete();
        })
      );

      service.populateFuelData();

      expect(fuelCostServiceSpy.loadFuelData).toHaveBeenCalledWith(
        '52420',
        new Date(2020, 0, 1),
        new Date(2021, 0, 1)
      );
    });
  });

  describe('getTotalFoodBeverageCost', () => {
    it('should get total food and beverage cost', () => {
      
      service.user.misc.beverageCostPerWeek = 10;
      service.user.misc.foodCostPerWeek = 10;
      service.timeData.totalWeeksSaved = 5;      

      const expectedCost = 100;

      const actualCost = service.getTotalFoodBeverageCost();

      expect(actualCost).toBe(expectedCost);
    });
  });

  describe('getTotalChildCareSavings', () => {
    it('should get the total child care savings', () => {  
      service.clearUserCache();    
      service.user.childCare.costPerWeek = 10.4567;       

      timeSavingsServiceSpy.getTotalRemoteWorkWeeks.and.returnValue(5);

      const expectedCost = 52.28;
      const acutalCost = service.getTotalChildCareSavings();

      expect(acutalCost).toBe(expectedCost);
    });
  });

  describe('getTotalMiscSavings', () => {
    it('should get total misc savings', () => {      
      service.user.misc.clothingCostPerYear = 100;      
      service.timeData.totalWeeksSaved = 100;

      const expectedCost = 192.31;
      const actualCost = service.getTotalMiscSavings();

      expect(actualCost).toBe(expectedCost);
    });
  });

  describe('getTotalDaysWorkedRemote', () => {
    it('should get get the total remote working days from the time savings service', () => {      
      
      service.getTotalDaysWorkedRemote();
      expect(timeSavingsServiceSpy.getTotalRemoteWorkingDays).toHaveBeenCalled();
    });
  });

  describe('getTotalCommuteMilesSaved', () => {
    it('should get the total commute miles saved without child care miles', () => {
      service.user.commute.commuteDistancePerDay = 10;
      timeSavingsServiceSpy.getTotalRemoteWorkingDays.and.returnValue(5);

      const expectedMiles = 100;
      const actualMiles = service.getTotalCommuteMilesSaved();

      expect(actualMiles).toBe(expectedMiles);
    });

    it('should get the total commute miles saved with child care miles', () => {
      service.user.commute.commuteDistancePerDay = 10;
      service.user.childCare.commuteInMilesPerDay = 10;
      timeSavingsServiceSpy.getTotalRemoteWorkingDays.and.returnValue(5);

      const expectedMiles = 150;
      const actualMiles = service.getTotalCommuteMilesSaved();

      expect(actualMiles).toBe(expectedMiles);
    });
  });
});
