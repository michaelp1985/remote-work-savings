import { Injectable } from '@angular/core';
import { CostSavingsType } from '../models/enumerations/cost-savings-type';
import { TimeSavingsType } from '../models/enumerations/time-savings-type';
import { CostSavingsReport } from '../models/reports/cost-savings-report';
import { TimeSavingsReport } from '../models/reports/time-savings-report';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private readonly userService: UserService) { }

  getUserCostSavingsReports(){
    let costSavingsReport: CostSavingsReport[] = [
      {
        name: CostSavingsType.Fuel,
        value: this.userService.userSavingsReport.totalFuelSavings
      },
      {
        name: CostSavingsType.ChildCare,
        value: this.userService.userSavingsReport.totalChildCareSavings
      },
      {
        name: CostSavingsType.FoodBeverage,
        value: this.userService.userSavingsReport.totalFoodBeverageSavings
      },
      {
        name: CostSavingsType.Misc,
        value: this.userService.userSavingsReport.totalMiscSavings
      }
    ];

    return costSavingsReport;
  }

  getUserTimeSavingsReports(){
    let timeSavingsReport: TimeSavingsReport[] = [
      {
        name: TimeSavingsType.Commute,
        value: this.userService.timeData.totalMinutesSaved
      },
      {
        name: TimeSavingsType.ChildCare,
        value: this.userService.user.totalDaysWorkedRemote * this.userService.user.childCare.commuteInMinutesPerDay
      },
      {
        name: TimeSavingsType.MorningRoutine,
        value: this.userService.user.totalDaysWorkedRemote * this.userService.user.misc.morningRoutineInMinutes
      }
    ];

    return timeSavingsReport;
  }

  getUserTimeSavingsBreakdownReport(){
    
    const totalRemoteWorkingDays = this.userService.user.totalDaysWorkedRemote;
    let minsPerDay = Math.round(this.userService.timeData.totalMinutesSaved / totalRemoteWorkingDays);
    minsPerDay += this.userService.user.misc.morningRoutineInMinutes
    let weeksInMonth = 4.33;
    let weeksInYear = 52;

    let timeSavingsBreakdown: any[] = [
      {
        name: "Day",
        value: Math.round(minsPerDay)
      },
      {
        name: "Week",
        value: Math.round(minsPerDay * this.userService.user.remoteWorkHistory.remoteWorkDays)
      },
      {
        name: "Month",
        value: Math.round(minsPerDay * (this.userService.user.remoteWorkHistory.remoteWorkDays * weeksInMonth))
      },
      {
        name: "Year",
        value: Math.round(minsPerDay * (this.userService.user.remoteWorkHistory.remoteWorkDays * weeksInYear))
      }                  
    ];

    return timeSavingsBreakdown;
  }

  getUserCostSavingsBreakdownReport(){
    
    let costSavedPerDay = this.userService.calculateTotalMoneySaved();
  }
}
