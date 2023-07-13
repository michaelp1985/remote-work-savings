import { Injectable } from '@angular/core';
import { CostSavingsType } from '../models/enumerations/cost-savings-type';
import { TimeSavingsType } from '../models/enumerations/time-savings-type';
import { CostSavingsReport } from '../models/reports/cost-savings-report';
import { TimeSavingsReport } from '../models/reports/time-savings-report';
import { UserCostSavingsReport } from '../models/reports/user-cost-savings-report';
import { UserService } from './user.service';
import { UserTimeSavingsReport } from '../models/reports/user-time-savings-report';
import { DataFormatService } from './data-format.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  userSavingsReport: UserCostSavingsReport;

  constructor(private readonly userService: UserService) {
    this.userSavingsReport = this.getUserCostSavingsReport();
  }

  getUserCostSavingsReport() {
    this.userService.populateTimeData();
    let userSavingsReport: UserCostSavingsReport = {
      totalFoodBeverageSavings: this.userService.getTotalFoodBeverageCost(),
      totalMiscSavings: this.userService.getTotalMiscSavings(),
      totalFuelSavings: this.userService.getTotalFuelSavings(),
      totalChildCareSavings: this.userService.getTotalChildCareSavings(),
      totalMoneySavings: 0,
    };

    userSavingsReport.totalMoneySavings =
      userSavingsReport.totalChildCareSavings +
      userSavingsReport.totalFuelSavings +
      userSavingsReport.totalFoodBeverageSavings +
      userSavingsReport.totalMiscSavings;

    // round total money savings to 2 decimal places using math.round
    userSavingsReport.totalMoneySavings = Math.round(
      userSavingsReport.totalMoneySavings * 100
    ) / 100;

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
}
