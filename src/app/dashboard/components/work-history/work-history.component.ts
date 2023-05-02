import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CustomValidatorsModule } from 'src/app/shared/validators/custom-validators.module';

@Component({
  selector: 'app-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.scss'],
})
export class WorkHistoryComponent implements OnInit {
  startDate: Date;
  endDate: Date;
  remoteDays: number = 0;
  form!: FormGroup;

  constructor(private userService: UserService) {
    this.startDate = new Date();
    this.endDate = new Date();

    this.form = new FormGroup({
      remoteWorkDaysPerWeek: new FormControl<number>(
        this.userService.user.remoteWorkHistory.remoteWorkDaysPerWeek,
        [Validators.required, Validators.pattern(/[1-5]/)]
      ),
      startDate: new FormControl<Date>(
        this.userService.user.remoteWorkHistory.startDate,
        [
          Validators.required,
          CustomValidatorsModule.minDateValidator(new Date(2010, 0, 1)),
        ]
      ),
      endDate: new FormControl<Date>(
        this.userService.user.remoteWorkHistory.endDate,
        [
          Validators.required,
          CustomValidatorsModule.maxDateValidator(new Date()),
        ]
      ),
    });
  }

  get remoteWorkHistory() {
    return this.userService.user.remoteWorkHistory;
  }

  ngOnInit(): void {
    this.startDate = this.userService.user.remoteWorkHistory.startDate;
    this.endDate = this.userService.user.remoteWorkHistory.endDate;
    this.remoteDays =
      this.userService.user.remoteWorkHistory.remoteWorkDaysPerWeek;
  }

  ngOnDestroy() {
    this.userService.user.remoteWorkHistory = this.form.value;
  }
}
