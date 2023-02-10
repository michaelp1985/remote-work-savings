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

  getUserSavingsReports(){
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
        value: 100
      },
      {
        name: TimeSavingsType.ChildCare,
        value: 50
      },
      {
        name: TimeSavingsType.MorningRoutine,
        value: 25
      }
    ];

    return timeSavingsReport;
  }
}
