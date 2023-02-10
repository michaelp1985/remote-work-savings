import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CostSavingsType } from 'src/app/models/enumerations/cost-savings-type';
import { TimeSavingsType } from 'src/app/models/enumerations/time-savings-type';
import { UserSavingsReport } from 'src/app/models/reports/user-savings-report';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit { 
  darkMode = false;
  userSavingsReport: UserSavingsReport;
  costReport?: any[];
  timeReport?: any[];

  // TODO: Add following info
  // cost saved per year / month / day / week (chart here)
  // time saved per year / month / day / week (char here)


  // chart options
  view: [number, number] = [1, 1];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  constructor(private readonly userService: UserService,
    private readonly reportService: ReportService) {     
    this.userService.calculateFuelCost();
    this.userService.calculateTimeSaved();
    this.userService.calculateFoodBeverageCost();
    this.userService.calculateTotalMoneySaved();
    this.view = [350, 400];

    this.populateTestData();
    // generate reports from user service
    this.userSavingsReport = userService.userSavingsReport;
    this.costReport = this.reportService.getUserSavingsReports();
    this.timeReport = this.reportService.getUserTimeSavingsReports();    
    Object.assign(this, { timeReport: this.timeReport, costReport: this.costReport });
  }
  ngAfterViewInit(): void {
    this.darkMode = !this.isLight();
  }

  ngOnInit(): void {

  }

  onSelect(event: any) {
    console.log(event);
  }

  labelFormatFunction(label: any): string {
    return label; //`<span style="color: white;">${label}</span>`;
  }

  populateTestData(){
    this.userService.userSavingsReport = {
      totalChildCareSavings: 100,
      totalFoodBeverageSavings: 50,
      totalFuelSavings: 1000,
      totalMiscSavings: 200,
      totalTimeSavings: 5000,
      totalMoneySavings: 10000
    }
  }

  isLight() {
    const body = document?.querySelector("body") ?? new HTMLBodyElement();
    const s = window.getComputedStyle(body);
    const color = s.getPropertyValue("background-color");

    const [r, g, b] = color.match(/\d+/g)?.map(Number) ?? [0,0,0];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance >= 128;
  }
}
