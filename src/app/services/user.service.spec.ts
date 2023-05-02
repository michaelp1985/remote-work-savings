import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { User } from '../models/user.model';
import { FuelCostService } from './fuel-cost.service';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';
import { State } from '../models/state.model';
import { AutoType } from '../models/enumerations/auto-type';
import { TransportationType } from '../models/enumerations/transportation-type';

describe('UserService', () => {
  let service: UserService;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  const fuelCostServiceSpy = jasmine.createSpyObj('FuelCostService', [
    'loadFuelData',
    'getFuelDataByFuelType',
    'fuelData$',
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
      ],
    });

    fuelCostServiceSpy.fuelData = jasmine.createSpyObj('fuelData$', [
      'subscribe',
    ]);
    service = TestBed.inject(UserService);
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
      let user = new User();

      user.misc.beverageCostPerWeek = 10;
      user.misc.foodCostPerWeek = 10;
      service.timeData.totalWeeksSaved = 5;

      service.user = user;

      const expectedCost = 100;

      const actualCost = service.getTotalFoodBeverageCost();

      expect(actualCost).toBe(expectedCost);
    });
  });

  describe('getTotalChildCareSavings', () => {
    it('should get the total child care savings', () => {
      let user = new User();
      user.childCare.costPerWeek = 10.4567;
      service.timeData.totalWeeksSaved = 5;

      service.user = user;

      const expectedCost = 52.28;
      const acutalCost = service.getTotalChildCareSavings();

      expect(acutalCost).toBe(expectedCost);
    });
  });

  describe('getTotalMiscSavings', () => {
    it('should get total misc savings', () => {
      let user = new User();
      user.misc.clothingCostPerYear = 100;
      service.user = user;
      service.timeData.totalWeeksSaved = 100;

      const expectedCost = 192.31;
      const actualCost = service.getTotalMiscSavings();

      expect(actualCost).toBe(expectedCost);
    });
  });

  describe('getTotalDaysWorkedRemote', () => {
    it('should get total number of remote working days for given time frame', () => {
      let user = new User();

      user.remoteWorkHistory = {
        startDate: new Date(2020, 0, 1),
        endDate: new Date(2021, 0, 1),
        remoteWorkDaysPerWeek: 5,
      };

      service.user = user;

      const actualRemoteWorkingDays = service.getTotalDaysWorkedRemote();
      expect(actualRemoteWorkingDays).toBe(260);
    });
  });

  describe('getTotalTimeSavedInMinutes', () => {
    it('should get total time saved in minutes', () => {
      let user = new User();

      user.remoteWorkHistory = {
        startDate: new Date(2020, 0, 1),
        endDate: new Date(2021, 0, 1),
        remoteWorkDaysPerWeek: 5,
      };

      user.commute = {
        commuteMinutesPerDay: 30,
        commuteDistancePerDay: 30,
        autoType: AutoType.Car,
        fuelType: 'Gasoline',
        transportationType: TransportationType.personalMoto,
        oilChangeCost: 40,
      };

      user.childCare = {
        costPerWeek: 100,
        commuteInMinutesPerDay: 30,
        commuteInMilesPerDay: 20,
      };

      service.user = user;

      const actualTimeSavedInMinutes = service.getTotalTimeSavedInMinutes();
      expect(actualTimeSavedInMinutes).toBe(15600);
    });
  });
});
