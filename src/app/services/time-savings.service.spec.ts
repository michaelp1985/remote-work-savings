import { TestBed } from '@angular/core/testing';
import { TimeSavingsService } from './time-savings.service';
import { RemoteWorkhistory } from '../models/remote-workhistory.model';
import { Misc } from '../models/misc';
import { ChildCare } from '../models/child-care';
import { Commute } from '../models/commute.model';

describe('TimeSavingsService', () => {
  let service: TimeSavingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeSavingsService);
  });

  describe('Verify Service', () => {
    it('Time Saving Service should be defined', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getWorkingDaysOfMonthByYear', () => {
    it('should get the number of working days for the month of Febuary in year 2020', () => {
      const date = new Date(2023, 2, 1);

      const workingDays = service.getWorkingDaysOfMonthByYear(
        date.getMonth(),
        date.getFullYear(),
        date.getDate()
      );

      console.log(workingDays);
    });
  });

  describe('getDayOfYear', () => {
    it('should get the day of the year', () => {
      const date = new Date(2020, 1, 1);

      const dayOfYear = service.getDayOfYear(date);

      expect(dayOfYear).toBe(32);
    });
  });

  describe('getDaysInYear', () => {
    it('should get the number of days in the year', () => {
      const date = new Date(2020, 1, 1);

      const daysInYear = service.getDaysInYear(date.getFullYear());

      expect(daysInYear).toBe(366);
    });
  });

  describe('getTotalPossibleWorkingDays', () => {
    it('should get the total number of possible working days', () => {
      const remoteWorkHistory: RemoteWorkhistory = {
        startDate: new Date(2019, 1, 1),
        endDate: new Date(2020, 1, 1),
        remoteWorkDaysPerWeek: 5,
      };

      const totalPossibleWorkingDays =
        service.getTotalPossibleWorkingDays(remoteWorkHistory);

      expect(totalPossibleWorkingDays).toBe(261);
    });
  });

  describe('getTotalRemoteWorkingDays', () => {
    it('should get the total number of remote working days', () => {
      const remoteWorkHistory: RemoteWorkhistory = {
        startDate: new Date(2019, 1, 1),
        endDate: new Date(2020, 1, 1),
        remoteWorkDaysPerWeek: 3,
      };

      const totalRemoteWorkingDays =
        service.getTotalRemoteWorkingDays(remoteWorkHistory);

      expect(totalRemoteWorkingDays).toBe(156);
    });
  });

  // test calculateTotalTimeSavingsToday
  describe('calculateTotalTimeSavingsToday', () => {
    it('should get the total time savings today', () => {
      // remote work history test data for 2020
      const remoteWorkHistory: RemoteWorkhistory = {
        startDate: new Date(2020, 1, 1),
        endDate: new Date(2020, 12, 31),
        remoteWorkDaysPerWeek: 3,
      };

      // test commute data
      const commuteData: Commute = {
        autoType: 'car',
        commuteDistancePerDay: 10,
        commuteMinutesPerDay: 60,
        fuelType: 'gas',
        oilChangeCost: 50,
        transportationType: 'auto',
      };

      // test child care data using childcare model
      const childCareData: ChildCare = {
        costPerWeek: 100,
        commuteInMinutesPerDay: 60,
        commuteInMilesPerDay: 10,
      };

      // test misc data
      const miscData: Misc = {
        clothingCostPerYear: 100,
        morningRoutineInMinutes: 30,
        beverageCostPerWeek: 10,
        foodCostPerWeek: 10,
      };

      // call the calculateTotalTimeSavingsToday method with test data
      const totalTimeSavingsToday = service.calculateTotalTimeSavingsToday(
        commuteData,
        remoteWorkHistory,
        childCareData,
        miscData
      );

      //log the results
      console.log(totalTimeSavingsToday);
      expect(totalTimeSavingsToday.totalDaysSaved).toBe(16);
      expect(totalTimeSavingsToday.totalHoursSaved).toBe(390);
      expect(totalTimeSavingsToday.totalMinutesSaved).toBe(23400);
      expect(totalTimeSavingsToday.totalMinutesMinusHoursSaved).toBe(0);
      expect(totalTimeSavingsToday.totalWeeksSaved).toBe(3);
    });
  });
});
