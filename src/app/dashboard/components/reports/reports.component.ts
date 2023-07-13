import { AfterContentChecked, Component } from '@angular/core';
import { UserCostSavingsReport } from 'src/app/models/reports/user-cost-savings-report';
import { UserTimeSavingsReport } from 'src/app/models/reports/user-time-savings-report';
import { ReportService } from 'src/app/services/report.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TotalTimeSavedReport } from 'src/app/models/reports/total-time-saved-report';

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
  totalTimeSavedReport: TotalTimeSavedReport;

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
    
    var minutes = this.userTimeSavingsReport.totalTimeSaved % 60;
    var hours = Math.floor(this.userTimeSavingsReport.totalTimeSaved / 60) % 24;
    var days = Math.floor((this.userTimeSavingsReport.totalTimeSaved / 60) / 24);

    this.totalTimeSavedReport = {
      minutesSaved: minutes,
      hoursSaved: hours,
      daysSaved: days,
    };

    this.screenWidth = Math.min(window.innerWidth * 0.9, 350);
  }

  ngAfterContentChecked(): void {
    this.darkMode = !this.isLight();
  }

  async setShareImage() {

    const totalCostSavingsReport = document.getElementById(
      'totalCostSavingsReport'
    );

    if (!totalCostSavingsReport) return;

    const costReport = await html2canvas(totalCostSavingsReport, {
      scale: 2,
    });

    const costImage1 = costReport.toDataURL('costshare/png');

    let shareButtons = document.querySelector(".sharethis-sticky-share-buttons");

    if (shareButtons) {
      shareButtons.setAttribute("data-image", costImage1)
    }
  }

  async savePDF() {
    const totalCostSavingsReport = document.getElementById(
      'totalCostSavingsReport'
    );
    const totalTimeSavingsReport = document.getElementById(
      'totalTimeSavingsReport'
    );
    const costSavingsBreakdownReport = document.getElementById(
      'costSavingsBreakdownReport'
    );
    const timeSavingsBreakdownReport = document.getElementById(
      'timeSavingsBreakdownReport'
    );

    if (
      totalCostSavingsReport &&
      totalTimeSavingsReport &&
      costSavingsBreakdownReport &&
      timeSavingsBreakdownReport
    ) {
      const costReport = await html2canvas(totalCostSavingsReport, {
        scale: 2,
      });
      const costImage1 = costReport.toDataURL('cost1/png');

      const timeReport = await html2canvas(totalTimeSavingsReport, {
        scale: 2,
      });
      const timeImage1 = timeReport.toDataURL('time1/png');

      const costBreakdownReport = await html2canvas(
        costSavingsBreakdownReport,
        { scale: 2 }
      );
      const costImage2 = costBreakdownReport.toDataURL('cost2/png');

      const timeBreakdownReport = await html2canvas(
        timeSavingsBreakdownReport,
        { scale: 2 }
      );
      const timeImage2 = timeBreakdownReport.toDataURL('time2/png');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [window.innerWidth, window.innerHeight],
        compress: true,
      });

      const isMobile =
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.innerWidth < 760;

      doc.setFillColor(0, 170, 255);
      doc.rect(0, 0, doc.internal.pageSize.width, 80, 'F');
      
      doc.setFontSize(40);
      doc.setTextColor(255, 255, 255);
      doc.text('Savings Report', doc.internal.pageSize.width / 2, 50, {
        align: 'center',
      });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);

      if (!isMobile) {
        doc.text(
          `You've saved a total of $${this.userCostSavingsReport.totalMoneySavings} dollars and ${this.userTimeSavingsReport.totalTimeSaved} minutes on your remote work journey!`,
          10,
          100
        );
        doc.addImage(costImage1, 'PNG', 20, 110, 200, 200);
        doc.addImage(timeImage1, 'PNG', 240, 110, 200, 200);

        doc.text(
          'Cost savings breakdown by amount of money saved per day, week, month, and year.',
          10,
          350
        );
        doc.addImage(costImage2, 'PNG', 20, 360, 200, 200);

        doc.text(
          'Times savings breakdown by time period of time saved per day, week, month, and year.',
          10,
          610
        );
        doc.addImage(timeImage2, 'PNG', 20, 620, 200, 200);
      } else {
        doc.text(
          `You've saved a total of $${this.userCostSavingsReport.totalMoneySavings} dollars`,
          10,
          100
        );
        doc.addImage(costImage1, 'PNG', 20, 120, 200, 200);

        doc.text(
          `You've saved a total of ${this.userTimeSavingsReport.totalTimeSaved} minutes on your remote work journey!`,
          10,
          360,
          { maxWidth: 300 }
        );
        doc.addImage(timeImage1, 'PNG', 20, 390, 200, 200);

        doc.addPage();

        doc.text(
          'Cost savings breakdown by amount of money saved per day, week, month, and year.',
          10,
          20,
          { maxWidth: 300 }
        );
        doc.addImage(costImage2, 'PNG', 20, 50, 200, 200);

        doc.text(
          'Times savings breakdown by time period of time saved per day, week, month, and year.',
          10,
          290,
          { maxWidth: 300 }
        );
        doc.addImage(timeImage2, 'PNG', 20, 320, 200, 200);
      }

      doc.save('my-document.pdf');
    } else {
      console.log('No data');
    }
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
