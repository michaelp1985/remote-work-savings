import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

export interface SummaryData {
  type: string;
  name: string;
  value: any;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  user: User;
  displayedColumns: string[] = ['name', 'value'];
  summaryData: SummaryData[] = [];


  constructor(private readonly userService: UserService) {     
    this.user = this.userService.user;

    // this.user = {
    //   dateRemoteWorkBegin: new Date(2020, 0, 1),
    //   dateRemoteWorkEnded: new Date(),
    //   remoteWorkDaysPerWeek: 5,
    //   commuteDistancePerDay: 10,
    //   commuteMinutesPerDay: 30,
    //   transportationType: TransportationType.personalMoto,
    //   autoType: AutoType.Car,
    //   fuelType: "Regular Gasoline",
    //   publicTransportationCostPerDay: 0,
    //   childCareCommuteInMilesPerDay: 0,
    //   childCareCommuteInMinutesPerDay: 0,
    //   childCareCostPerWeek: 0,
    //   clothingCostPerYear: 0,
    //   city: new City(),
    //   beverageCostPerWeek: 0,
    //   foodCostPerWeek: 0,
    //   morningRoutineInMinutes: 0,
    //   state: { abbreviation: "MO", area: "", name: "" }
    // }
  }

  ngOnInit(): void {    
    console.log(this.user);
    this.populateSummaryData();
  }

  private populateSummaryData(){

    this.summaryData.push({
      type: 'Work History',
      name: 'Remote Start Date',
      value: this.user.remoteWorkHistory.startDate.toDateString(),
    });
    
    this.summaryData.push({
      type: 'Work History',
      name: 'Remote End Date',
      value: this.user.remoteWorkHistory.endDate.toDateString(),
    });

    this.summaryData.push({
      type: 'Work History',
      name: 'Remote Days / Week',
      value: this.user.remoteWorkHistory.remoteWorkDays,
    });

    this.summaryData.push({
      type: 'Commute',
      name: 'Commute Distance / Day',
      value: this.user.commute.commuteDistancePerDay,
    });

    this.summaryData.push({
      type: 'Commute',
      name: 'Commute Minutes / Day',
      value: this.user.commute.commuteMinutesPerDay,
    });

    this.summaryData.push({
      type: 'Transportation',
      name: 'Transportation Type',
      value: this.user.commute.transportationType,
    });

    this.summaryData.push({
      type: 'Transportation',
      name: 'Auto Type',
      value: this.user.commute.autoType,
    });

    this.summaryData.push({
      type: 'Transportation',
      name: 'Fuel Type',
      value: this.user.commute.fuelType,
    });

    this.summaryData.push({
      type: 'Transportation',
      name: 'Public Trans Cost / Day',
      value: this.user.commute.publicTransportationCostPerDay,
    });

    this.summaryData.push({
      type: 'Misc',
      name: 'Clothing Cost / Year',
      value: this.user.commute.publicTransportationCostPerDay,
    });

    this.summaryData.push({
      type: 'Misc',
      name: 'Morning Routine Mins / Day',
      value: this.user.misc.morningRoutineInMinutes,
    });

    this.summaryData.push({
      type: 'Food & Beverage',
      name: 'Food Cost / Week',
      value: this.user.misc.foodCostPerWeek,
    });

    this.summaryData.push({
      type: 'Food & Beverage',
      name: 'Beverage Cost / Week',
      value: this.user.misc.beverageCostPerWeek,
    });

    this.summaryData.push({
      type: 'Child Care',
      name: 'Child Care Cost / Week',
      value: this.user.childCare.costPerWeek,
    });

    this.summaryData.push({
      type: 'Child Care',
      name: 'Child Care Commute Miles / Day',
      value: this.user.childCare.commuteInMilesPerDay,
    });

    this.summaryData.push({
      type: 'Child Care',
      name: 'Child Care Commute Mins / Day',
      value: this.user.childCare.commuteInMinutesPerDay,
    });
  }
}
