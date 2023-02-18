import { AfterViewInit, Component } from '@angular/core';
import { UserSavingsReport } from 'src/app/models/reports/user-savings-report';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements AfterViewInit { 
  chartTitle = 'test';
  darkMode = false;
  userSavingsReport: UserSavingsReport;
  costReport: any = {
    title: "Cost Savings",
    data: []
  }
  timeReport: any = {
    title: "Time Savings",
    data: []
  }
  timeBreakdownReport: any = {
    title: "Time Breakdown",
    data: []
  }

  // TODO: Add following info
  // cost saved per year / month / day / week (chart here)
  // time saved per year / month / day / week (char here)
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';


  // chart options
  view: [number, number] = [350, 300];
  barView: [number, number] = [300, 300]
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  constructor(private readonly userService: UserService,
    private readonly reportService: ReportService) {     
    this.userService.calculateFuelCost();
    this.userService.calculateTimeSaved();
    this.userService.calculateFoodBeverageCost();
    this.userService.calculateTotalMoneySaved();    

    this.userSavingsReport = userService.userSavingsReport;
    this.costReport.data = this.reportService.getUserCostSavingsReports();    
    this.timeReport.data = this.reportService.getUserTimeSavingsReports();
    this.timeBreakdownReport.data = this.reportService.getUserTimeSavingsBreakdownReport();   
    console.log(JSON.stringify(this.timeBreakdownReport.data));     
  }

  ngAfterViewInit(): void {
    this.darkMode = !this.isLight();
  }

  onSelect(event: any) {
    console.log(event);
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
