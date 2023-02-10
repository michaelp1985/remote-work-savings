import { Injectable } from '@angular/core';
import { Commute } from '../models/commute.model';
import { TimeData } from '../models/time.model';
import { UserSavingsReport } from '../models/reports/user-savings-report';
import { User } from '../models/user.model';
import { AutoService } from './auto.service';
import { FuelCostService } from './fuel-cost.service';
import { TimeSavingsService } from './time-savings.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  timeData: TimeData;
  userSavingsReport: UserSavingsReport;
  commuteData: Commute;  
  user: User;

  constructor(private readonly fuelService: FuelCostService,
    private readonly timeService: TimeSavingsService,
    private readonly autoService: AutoService) { 
    this.user = new User();
    this.commuteData = new Commute();    
    this.timeData = new TimeData();

    this.userSavingsReport = {
      totalChildCareSavings: 0,
      totalFoodBeverageSavings: 0,
      totalFuelSavings: 0,
      totalMiscSavings: 0,
      totalTimeSavings: 0,
      totalMoneySavings: 0
    };
  }

  calculateFoodBeverageCost(){
    this.userSavingsReport.totalFoodBeverageSavings = 
      (this.user.misc.beverageCostPerWeek + this.user.misc.foodCostPerWeek) * this.timeData.totalWeeksSaved;
  }

  populateFuelData(){
    let area = this.user.city?.area ?? this.user.state?.area ?? "";    
    this.fuelService.loadFuelData(area, this.user.remoteWorkHistory.startDate, this.user.remoteWorkHistory.endDate);

    this.fuelService.fuelData.subscribe(data => {      
      if (data.length == 0) return;            
      this.calculateFuelCost();
    });
  }

  calculateTimeSaved(){
    this.timeData = this.timeService.calculateTimeSavingsToday(this.commuteData, this.user.remoteWorkHistory);
    this.userSavingsReport.totalTimeSavings = this.timeData.totalMinutesSaved > 0 ? Math.round(this.timeData.totalMinutesSaved * 100) / 100 : 0;
  }

  calculateTotalMoneySaved(){
    let totalSaved = (
      this.userSavingsReport.totalChildCareSavings + 
      this.userSavingsReport.totalFuelSavings + 
      this.userSavingsReport.totalFoodBeverageSavings + 
      this.userSavingsReport.totalMiscSavings);

    this.userSavingsReport.totalMoneySavings = totalSaved > 0 ? Math.round(totalSaved * 100) / 100 : 0;
  }

  calculateFuelCost(){
    let fuelData = this.fuelService.getFuelDataByFuelType(this.user.commute.fuelType ?? "");
    let totalFuelCost = 0;
    this.userSavingsReport.totalFuelSavings = 0;

    for (let data of fuelData){
      let month = Number(data.period.split('-')[1]);
      let year = Number(data.period.split('-')[0]);

      let workingDaysInMonth = this.timeService.getWorkingDaysOfMonthByYear(month, year)
      let costPerDay = this.getFuelCostPerDay(data.value);
      totalFuelCost += costPerDay * workingDaysInMonth;
    }

    this.userSavingsReport.totalFuelSavings += totalFuelCost;
    console.log(this.userSavingsReport.totalFuelSavings);
  }

  getFuelCostPerDay(fuelCost: number) {
    let totalMiles = (this.user.commute.commuteDistancePerDay + this.user.childCare.commuteInMilesPerDay) * 2;

    // TODO: get mgp by auto type / allow for default mpg and override default mpg from UI
    let mpg = this.autoService.getMpgByAutoType(this.user.commute.autoType);
    let gallonsUsedPerDay = (totalMiles * 2) / mpg;
    return fuelCost * gallonsUsedPerDay;
  }  
}
