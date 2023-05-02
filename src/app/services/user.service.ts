import { Injectable } from '@angular/core';
import { TimeData } from '../models/time.model';
import { User } from '../models/user.model';
import { AutoService } from './auto.service';
import { FuelCostService } from './fuel-cost.service';
import { TimeSavingsService } from './time-savings.service';
import { AutoType } from '../models/enumerations/auto-type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  timeData: TimeData;
  user: User;

  constructor(
    private readonly fuelService: FuelCostService,
    private readonly timeService: TimeSavingsService,
    private readonly autoService: AutoService
  ) {
    this.user = new User();
    this.timeData = new TimeData();
  }

  populateFuelData() {
    let area = this.user.city?.area ?? this.user.state?.area ?? '';
    this.fuelService.loadFuelData(
      area,
      this.user.remoteWorkHistory.startDate,
      this.user.remoteWorkHistory.endDate
    );

    this.fuelService.fuelData.subscribe((data) => {
      if (data.length == 0) return;
      console.log('Fuel Data Loaded');
    });
  }

  getTotalFoodBeverageCost() {
    const foodBeverageCost =
      (this.user.misc.beverageCostPerWeek + this.user.misc.foodCostPerWeek) *
      this.timeData.totalWeeksSaved;

    return this.formatCurrency(foodBeverageCost);
  }

  getTotalChildCareSavings() {
    const childCareSavings =
      this.user.childCare.costPerWeek * this.timeData.totalWeeksSaved;

    return this.formatCurrency(childCareSavings);
  }

  getTotalMiscSavings() {
    const miscSavings =
      this.user.misc.clothingCostPerYear * (this.timeData.totalWeeksSaved / 52);

    return this.formatCurrency(miscSavings);
  }

  getTotalDaysWorkedRemote() {
    return this.timeService.getTotalRemoteWorkingDays(
      this.user.remoteWorkHistory
    );
  }

  getTotalTimeSavedInMinutes() {
    return this.timeService.calculateTotalTimeSavingsToday(
      this.user.commute,
      this.user.remoteWorkHistory,
      this.user.childCare,
      this.user.misc
    ).totalMinutesSaved;
  }

  populateTimeData() {
    this.timeData = this.timeService.calculateTotalTimeSavingsToday(
      this.user.commute,
      this.user.remoteWorkHistory,
      this.user.childCare,
      this.user.misc
    );
  }

  getTotalMorningRoutineTimeSaved(): number {
    return this.timeService.calculateTotalTimeSavedByMinutes(this.user.misc.morningRoutineInMinutes, this.user.remoteWorkHistory).totalMinutesSaved;
  }
  getTotalCommuteTimeSaved(): number {
    return this.timeService.calculateTotalTimeSavedByMinutes(this.user.commute.commuteMinutesPerDay, this.user.remoteWorkHistory).totalMinutesSaved;
  }
  getTotalChildCareTimeSaved(): number {
    return this.timeService.calculateTotalTimeSavedByMinutes(this.user.childCare.commuteInMinutesPerDay, this.user.remoteWorkHistory).totalMinutesSaved;
  }

  getTotalFuelSavings() {
    let fuelData = this.fuelService.getFuelDataByFuelType(
      this.user.commute.fuelType ?? ''
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
    let totalMiles =
      (this.user.commute.commuteDistancePerDay +
        this.user.childCare.commuteInMilesPerDay) *
      2;

    // TODO: get mgp by auto type / allow for default mpg and override default mpg from UI
    let mpg = this.autoService.getMpgByAutoType(
      AutoType[this.user.commute.autoType as keyof typeof AutoType]
    );
    let gallonsUsedPerDay = (totalMiles * 2) / mpg;
    return fuelCost * gallonsUsedPerDay;
  }
}
