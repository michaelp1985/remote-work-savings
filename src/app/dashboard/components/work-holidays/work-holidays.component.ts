import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CustomValidatorsModule } from 'src/app/shared/validators/custom-validators.module';

@Component({
  selector: 'app-work-holidays',
  templateUrl: './work-holidays.component.html',
  styleUrls: ['./work-holidays.component.scss'],
})
export class WorkHolidaysComponent implements OnInit {
  holidayCount: number = 6;
  form: FormGroup;

  workHolidayCount: FormControl = new FormControl(
    this.userService.user.remoteWorkHistory.holidayCountPerYear,
    [CustomValidatorsModule.numericValidator()]
  );

  constructor(private readonly userService: UserService) {
    this.holidayCount =
      this.userService.user.remoteWorkHistory.holidayCountPerYear;

    this.form = new FormGroup({});
    this.form.addControl('workHolidayCount', this.workHolidayCount);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.userService.user.remoteWorkHistory.holidayCountPerYear = parseInt(
      this.holidayCount.toString()
    );
  }
}
