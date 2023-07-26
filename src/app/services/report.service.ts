import { Injectable } from '@angular/core';
import { CostSavingsType } from '../models/enumerations/cost-savings-type';
import { TimeSavingsType } from '../models/enumerations/time-savings-type';
import { CostSavingsReport } from '../models/reports/cost-savings-report';
import { TimeSavingsReport } from '../models/reports/time-savings-report';
import { UserCostSavingsReport } from '../models/reports/user-cost-savings-report';
import { UserService } from './user.service';
import { UserTimeSavingsReport } from '../models/reports/user-time-savings-report';
import { DataFormatService } from './data-format.service';
import { TransportationType } from '../models/enumerations/transportation-type';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  userSavingsReport: UserCostSavingsReport;
  transportationTypeIsAuto = false;

  constructor(private readonly userService: UserService) {
    this.userSavingsReport = this.getUserCostSavingsReport();
    this.transportationTypeIsAuto =
      userService.user.commute.transportationType ==
      TransportationType.personalMoto;
  }

  getUserCostSavingsReport() {
    this.userService.populateTimeData();
    let userSavingsReport: UserCostSavingsReport = {
      totalFoodBeverageSavings: this.userService.getTotalFoodBeverageCost(),
      totalMiscSavings: this.userService.getTotalMiscSavings(),
      totalFuelSavings: this.userService.getTotalFuelSavings(),
      totalChildCareSavings: this.userService.getTotalChildCareSavings(),
      totalMoneySavings: 0,
      totalMilesSaved: this.userService.getTotalCommuteMilesSaved(),
      totalFuelSaved: this.userService.getTotalFuelSaved(),
    };

    userSavingsReport.totalMoneySavings =
      userSavingsReport.totalChildCareSavings +
      userSavingsReport.totalFuelSavings +
      userSavingsReport.totalFoodBeverageSavings +
      userSavingsReport.totalMiscSavings;

    userSavingsReport.totalMoneySavings =
      Math.round(userSavingsReport.totalMoneySavings * 100) / 100;

    if (isNaN(userSavingsReport.totalFuelSaved)) {
      userSavingsReport.totalFuelSaved = 0;
    }

    this.userSavingsReport = userSavingsReport;

    return this.userSavingsReport as UserCostSavingsReport;
  }

  getUserTimeSavingsReport() {
    let userTimeSavingsReport: UserTimeSavingsReport = {
      totalChildCareTimeSaved: this.userService.getTotalChildCareTimeSaved(),
      totalCommuteTimeSaved: this.userService.getTotalCommuteTimeSaved(),
      totalMorningRoutineTimeSaved:
        this.userService.getTotalMorningRoutineTimeSaved(),
      totalTimeSaved: 0,
    };

    userTimeSavingsReport.totalTimeSaved =
      userTimeSavingsReport.totalChildCareTimeSaved +
      userTimeSavingsReport.totalCommuteTimeSaved +
      userTimeSavingsReport.totalMorningRoutineTimeSaved;

    return userTimeSavingsReport as UserTimeSavingsReport;
  }

  getUserCostSavingsReports() {
    const report = this.userSavingsReport;

    const costSavingsReport: CostSavingsReport[] = [
      {
        name: CostSavingsType.Fuel,
        value: report.totalFuelSavings,
      },
      {
        name: CostSavingsType.ChildCare,
        value: report.totalChildCareSavings,
      },
      {
        name: CostSavingsType.FoodBeverage,
        value: report.totalFoodBeverageSavings,
      },
      {
        name: CostSavingsType.Misc,
        value: report.totalMiscSavings,
      },
      // TODO: add auto
    ];

    return costSavingsReport;
  }

  getUserTimeSavingsReports() {
    const userTimeSavingsReport = this.getUserTimeSavingsReport();

    const timeSavingsReport: TimeSavingsReport[] = [
      {
        name: TimeSavingsType.Commute,
        value: userTimeSavingsReport.totalCommuteTimeSaved,
      },
      {
        name: TimeSavingsType.MorningRoutine,
        value: userTimeSavingsReport.totalMorningRoutineTimeSaved,
      },
      {
        name: TimeSavingsType.ChildCare,
        value: userTimeSavingsReport.totalChildCareTimeSaved,
      },
    ];

    return timeSavingsReport;
  }

  getUserTimeSavingsBreakdownReport() {
    const timeSavingsReport = this.getUserTimeSavingsReport();

    const totalRemoteWorkingDays = this.userService.getTotalDaysWorkedRemote();
    const minsPerDay = Math.round(
      timeSavingsReport.totalTimeSaved / totalRemoteWorkingDays
    );
    const weeksInMonth = 4.33;
    const weeksInYear = 52;
    const user = this.userService.user;

    const timeSavingsBreakdown: any[] = [
      {
        name: 'Per Day',
        value: DataFormatService.formatMinutesAsDaysHoursMinutes(minsPerDay),
      },
      {
        name: 'Per Week',
        value: DataFormatService.formatMinutesAsDaysHoursMinutes(
          Math.round(minsPerDay * user.remoteWorkHistory.remoteWorkDaysPerWeek)
        ),
      },
      {
        name: 'Per Month',
        value: DataFormatService.formatMinutesAsDaysHoursMinutes(
          Math.round(
            minsPerDay *
              (user.remoteWorkHistory.remoteWorkDaysPerWeek * weeksInMonth)
          )
        ),
      },
      {
        name: 'Per Year',
        value: DataFormatService.formatMinutesAsDaysHoursMinutes(
          Math.round(
            minsPerDay *
              (user.remoteWorkHistory.remoteWorkDaysPerWeek * weeksInYear)
          )
        ),
      },
    ];

    return timeSavingsBreakdown;
  }

  getUserCostSavingsBreakdownReport() {
    const userSavingsReport = this.getUserCostSavingsReport();

    const totalRemoteWorkingDays = this.userService.getTotalDaysWorkedRemote();

    const costPerDay = Math.round(
      userSavingsReport.totalMoneySavings / totalRemoteWorkingDays
    );
    const weeksInMonth = 4.33;
    const weeksInYear = 52;

    const costSavingsBreakdown: any[] = [
      {
        name: 'Per Day',
        value: DataFormatService.formatAsCurrency(costPerDay),
      },
      {
        name: 'Per Week',
        value: DataFormatService.formatAsCurrency(
          Math.round(
            costPerDay *
              this.userService.user.remoteWorkHistory.remoteWorkDaysPerWeek
          )
        ),
      },
      {
        name: 'Per Month',
        value: DataFormatService.formatAsCurrency(
          Math.round(
            costPerDay *
              (this.userService.user.remoteWorkHistory.remoteWorkDaysPerWeek *
                weeksInMonth)
          )
        ),
      },
      {
        name: 'Per Year',
        value: DataFormatService.formatAsCurrency(
          Math.round(
            costPerDay *
              (this.userService.user.remoteWorkHistory.remoteWorkDaysPerWeek *
                weeksInYear)
          )
        ),
      },
    ];

    return costSavingsBreakdown;
  }

  getFuelSavingsBreakdownReport() {
    const user = this.userService.user;
    const totalRemoteWorkDays = this.userService.getTotalDaysWorkedRemote();

    const gallonsUsedPerDay = this.userSavingsReport.totalFuelSaved / totalRemoteWorkDays;
    const weeksInMonth = 4.33;
    const weeksInYear = 52;

    const fuelSavingsBreakdown: any[] = [
      {
        name: 'Per Day',
        value: Math.round((gallonsUsedPerDay) * 100) / 100,
      },
      {
        name: 'Per Week',
        value: Math.round((gallonsUsedPerDay * user.remoteWorkHistory.remoteWorkDaysPerWeek) * 100) / 100,
      },
      {
        name: 'Per Month',
        value: Math.round((gallonsUsedPerDay * (user.remoteWorkHistory.remoteWorkDaysPerWeek * weeksInMonth)) * 100) / 100,
      },
      {
        name: 'Per Year',
        value: Math.round((gallonsUsedPerDay * (user.remoteWorkHistory.remoteWorkDaysPerWeek * weeksInYear)) * 100) / 100,
      },
    ];

    return fuelSavingsBreakdown;    
  }

  getMilesSavingsBreakdownReport() {
    const user = this.userService.user;
    const totalRemoteWorkDays = this.userService.getTotalDaysWorkedRemote();

    const milesSavedPerDay = this.userSavingsReport.totalMilesSaved / totalRemoteWorkDays;
    const weeksInMonth = 4.33;
    const weeksInYear = 52;

    const milesSavingsBreakdown: any[] = [
      {
        name: 'Per Day',
        value: Math.round((milesSavedPerDay) * 100) / 100,
      },
      {
        name: 'Per Week',
        value: Math.round((milesSavedPerDay * user.remoteWorkHistory.remoteWorkDaysPerWeek) * 100) / 100,
      },
      {
        name: 'Per Month',
        value: Math.round((milesSavedPerDay * (user.remoteWorkHistory.remoteWorkDaysPerWeek * weeksInMonth)) * 100) / 100,
      },
      {
        name: 'Per Year',
        value: Math.round((milesSavedPerDay * (user.remoteWorkHistory.remoteWorkDaysPerWeek * weeksInYear)) * 100) / 100,
      },
    ];

    return milesSavingsBreakdown;    
  }
}
