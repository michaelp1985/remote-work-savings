import { AfterContentChecked, Component } from '@angular/core';
import { UserCostSavingsReport } from 'src/app/models/reports/user-cost-savings-report';
import { UserTimeSavingsReport } from 'src/app/models/reports/user-time-savings-report';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements AfterContentChecked {
  chartTitle = 'test';
  darkMode = false;
  userCostSavingsReport: UserCostSavingsReport;
  userTimeSavingsReport: UserTimeSavingsReport;
  costReport: any = {
    title: 'Cost Savings',
    data: [],
  };
  timeReport: any = {
    title: 'Time Savings',
    data: [],
  };
  timeBreakdownReport: any = {
    title: 'Time Breakdown',
    data: [],
  };
  costBreakdownReport: any = {
    title: 'Cost Breakdown',
    data: [],
  };

  displayedColumns: string[] = ['name', 'value'];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  screenWidth: number = 0;
  private readonly chartHeight = 300;

  view: [number, number] = [300, 300];
  pieChartColorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(private readonly reportService: ReportService) {

    this.userCostSavingsReport = this.reportService.getUserCostSavingsReport();
    this.userTimeSavingsReport = this.reportService.getUserTimeSavingsReport();
    this.costReport.data = this.reportService.getUserCostSavingsReports();
    this.timeReport.data = this.reportService.getUserTimeSavingsReports();
    this.timeBreakdownReport.data =
      this.reportService.getUserTimeSavingsBreakdownReport();

    this.costBreakdownReport.data =
      this.reportService.getUserCostSavingsBreakdownReport();

    this.screenWidth = Math.min(window.innerWidth * 0.9, 350);    
  }

  ngAfterContentChecked(): void {
    this.darkMode = !this.isLight();
  }

  onSelect(event: any) {
    console.log(event);
  }

  isLight() {
    const body = document?.querySelector('body') ?? new HTMLBodyElement();
    const s = window.getComputedStyle(body);
    const color = s.getPropertyValue('background-color');

    const [r, g, b] = color.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance >= 128;
  }
}
