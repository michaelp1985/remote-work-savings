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
  showMiles = false;
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
    title: 'Time Savings by Time Period',
    data: [],
  };
  costBreakdownReport: any = {
    title: 'Cost Savings by Time Period',
    data: [],
  };
  milesBreakdownReport: any = {
    title: 'Miles Saved by Time Period',
    data: [],
  };
  fuelBreakdownReport: any = {
    title: 'Fuel Saved by Time Period',
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

    this.milesBreakdownReport.data =
      this.reportService.getMilesSavingsBreakdownReport();

    this.fuelBreakdownReport.data =
      this.reportService.getFuelSavingsBreakdownReport();

    var minutes = this.userTimeSavingsReport.totalTimeSaved % 60;
    var hours = Math.floor(this.userTimeSavingsReport.totalTimeSaved / 60) % 24;
    var days = Math.floor(this.userTimeSavingsReport.totalTimeSaved / 60 / 24);

    this.totalTimeSavedReport = {
      minutesSaved: minutes,
      hoursSaved: hours,
      daysSaved: days,
    };

    this.screenWidth = Math.min(window.innerWidth * 0.9, 350);
    this.showMiles = reportService.transportationTypeIsAuto;
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

    let shareButtons = document.querySelector(
      '.sharethis-sticky-share-buttons'
    );

    if (shareButtons) {
      shareButtons.setAttribute('data-image', costImage1);
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
    const fuelSavingsBreakdownReport = document.getElementById(
      'fuelSavingsBreakdownReport'
    );
    const milesSavingsBreakdownReport = document.getElementById(
      'mileSavingsBreakdownReport'
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

      let fuelImage = null;
      if (fuelSavingsBreakdownReport) {
        const fuelBreakdownReport = await html2canvas(
          fuelSavingsBreakdownReport,
          { scale: 2 }
        );
        fuelImage = fuelBreakdownReport.toDataURL('fuel2/png');
      }

      let milesImage = null;
      if (milesSavingsBreakdownReport) {
        const milesBreakdownReport = await html2canvas(
          milesSavingsBreakdownReport,
          { scale: 2 }
        );
        milesImage = milesBreakdownReport.toDataURL('miles2/png');
      }

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
        if (fuelImage && milesImage) {
          doc.text(
            `You've driven ${this.userCostSavingsReport.totalMilesSaved} less miles and burned ${this.userCostSavingsReport.totalFuelSaved} less gallons of fuel!`,
            10,
            120
          );
        }
        doc.addImage(costImage1, 'PNG', 20, 130, 200, 200);
        doc.addImage(timeImage1, 'PNG', 240, 130, 200, 200);

        doc.text(
          'Cost savings breakdown by amount of money saved per day, week, month, and year.',
          10,
          370
        );
        doc.addImage(costImage2, 'PNG', 20, 380, 200, 200);

        doc.text(
          'Times savings breakdown by time period of time saved per day, week, month, and year.',
          10,
          630
        );
        doc.addImage(timeImage2, 'PNG', 20, 640, 200, 200);

        if (fuelImage) {
          doc.text(
            'Fuel savings breakdown by amount of fuel saved per day, week, month, and year.',
            10,
            880
          );
          doc.addImage(fuelImage, 'PNG', 20, 890, 200, 200);
        }

        if (milesImage) {
          doc.text(
            'Miles savings breakdown by amount of miles saved per day, week, month, and year.',
            10,
            1140
          );
          doc.addImage(milesImage, 'PNG', 20, 1150, 200, 200);
        }
      } else {
        let x = 100;
        doc.text(
          "Wow! Look at what you've managed to accomplish by working remote!",
          10,
          x,
          { maxWidth: 300 }
        );

        x += 40;
        doc.text("So far, you've managed to:", 10, x, { maxWidth: 300 });

        x += 20;
        doc.text(
          `Save a total of ${this.userCostSavingsReport.totalMoneySavings} dollars!`,
          10,
          x,
          { maxWidth: 300 }
        );

        x += 20;
        doc.text(
          `Save a total of ${this.userTimeSavingsReport.totalTimeSaved} minutes!`,
          10,
          x,
          { maxWidth: 300 }
        );

        if (milesImage && fuelImage) {
          x += 20;
          doc.text(
            `Drive ${this.userCostSavingsReport.totalMilesSaved} less miles!`,
            10,
            x,
            { maxWidth: 300 }
          );

          x += 20;
          doc.text(
            `Burn ${this.userCostSavingsReport.totalFuelSaved} less gallons of fuel!`,
            10,
            x,
            { maxWidth: 300 }
          );
        }

        x += 40;
        doc.text(
          'Here are some usefull charts to help you visualize your savings!',
          10,
          x,
          { maxWidth: 300 }
        );

        x += 20;
        doc.addImage(costImage1, 'PNG', 20, x, 200, 200);

        x += 220;
        doc.addImage(timeImage1, 'PNG', 20, x, 200, 200);

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

        if (fuelImage && milesImage) {
          doc.addPage();

          doc.text(
            'Fuel savings breakdown by amount of fuel saved per day, week, month, and year.',
            10,
            20,
            { maxWidth: 300 }
          );
          doc.addImage(fuelImage, 'PNG', 20, 50, 200, 200);

          doc.text(
            'Miles savings breakdown by amount of miles saved per day, week, month, and year.',
            10,
            290,
            { maxWidth: 300 }
          );
          doc.addImage(milesImage, 'PNG', 20, 320, 200, 200);
        }
      }

      doc.save('remote-work-savings-report.pdf');
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
