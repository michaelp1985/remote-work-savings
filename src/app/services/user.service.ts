import { Injectable } from '@angular/core';
import { TimeData } from '../models/time.model';
import { User } from '../models/user.model';
import { FuelCostService } from './fuel-cost.service';
import { TimeSavingsService } from './time-savings.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  timeData: TimeData;
  private cachedUser: User;

  constructor(
    private readonly fuelService: FuelCostService,
    private readonly timeService: TimeSavingsService
  ) {
    this.cachedUser = new User();
    this.timeData = new TimeData();
  }

  clearUserCache() {
    this.cachedUser = new User();
    this.timeData = new TimeData();
  }

  get user() {    
    return this.cachedUser;
  }

  populateFuelData() {
    let area = this.cachedUser.city?.area ?? this.cachedUser.state?.area ?? '';
    this.fuelService.loadFuelData(
      area,
      this.cachedUser.remoteWorkHistory.startDate,
      this.cachedUser.remoteWorkHistory.endDate
    );

    this.fuelService.fuelData.subscribe((data) => {
      if (data.length == 0) return;
      console.log('Fuel Data Loaded');
    });
  }

  getTotalFoodBeverageCost() {
    const foodBeverageCost =
      (this.cachedUser.misc.beverageCostPerWeek +
        this.cachedUser.misc.foodCostPerWeek) *
      this.timeData.totalWeeksSaved;

    return this.formatCurrency(foodBeverageCost);
  }

  getTotalChildCareSavings() {
    const workWeeks = this.timeService.getTotalRemoteWorkWeeks(
      this.cachedUser.remoteWorkHistory
    );

    const childCareSavings = this.cachedUser.childCare.costPerWeek * workWeeks;

    return this.formatCurrency(childCareSavings);
  }

  getTotalMiscSavings() {
    const miscSavings =
      this.cachedUser.misc.clothingCostPerYear *
      (this.timeData.totalWeeksSaved / 52);

    return this.formatCurrency(miscSavings);
  }

  getTotalDaysWorkedRemote() {
    return this.timeService.getTotalRemoteWorkingDays(
      this.cachedUser.remoteWorkHistory
    );
  }

  populateTimeData() {
    this.timeData = this.timeService.calculateTotalTimeSavingsToday(
      this.cachedUser.commute,
      this.cachedUser.remoteWorkHistory,
      this.cachedUser.childCare,
      this.cachedUser.misc
    );
  }

  getTotalMorningRoutineTimeSaved(): number {
    return this.timeService.calculateTotalTimeSavedByMinutes(
      this.cachedUser.misc.morningRoutineInMinutes,
      this.cachedUser.remoteWorkHistory
    ).totalMinutesSaved;
  }
  getTotalCommuteTimeSaved(): number {
    return this.timeService.calculateTotalTimeSavedByMinutes(
      this.cachedUser.commute.commuteMinutesPerDay,
      this.cachedUser.remoteWorkHistory
    ).totalMinutesSaved;
  }
  getTotalChildCareTimeSaved(): number {
    return this.timeService.calculateTotalTimeSavedByMinutes(
      this.cachedUser.childCare.commuteInMinutesPerDay,
      this.cachedUser.remoteWorkHistory
    ).totalMinutesSaved;
  }

  getTotalFuelSavings() {
    let fuelData = this.fuelService.getFuelDataByFuelType(
      this.cachedUser.commute.fuelType ?? ''
    );
    let totalFuelCost = 0;

    for (let data of fuelData) {
      let month = Number(data.period.split('-')[1]);
      let year = Number(data.period.split('-')[0]);

      let workingDaysInMonth = this.timeService.getWorkingDaysOfMonthByYear(
        month,
        year
      );
      let costPerDay = this.getFuelCostPerDay(data.value);
      totalFuelCost += costPerDay * workingDaysInMonth;
    }

    return this.formatCurrency(totalFuelCost);
  }

  private formatCurrency(value: number) {
    return value > 0 ? Math.round(value * 100) / 100 : 0;
  }

  private getFuelCostPerDay(fuelCost: number) {
    let totalMiles = this.cachedUser.commute.commuteDistancePerDay * 2 + this.cachedUser.childCare.commuteInMilesPerDay;

    let gallonsUsedPerDay = totalMiles / this.user.commute.mpg;
    return fuelCost * gallonsUsedPerDay;
  }
}
