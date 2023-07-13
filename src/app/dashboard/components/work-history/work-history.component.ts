import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CustomValidatorsModule } from 'src/app/shared/validators/custom-validators.module';
import { RemoteWorkhistory } from 'src/app/models/remote-workhistory.model';

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
  remoteWorkHistory: RemoteWorkhistory;

  constructor(private userService: UserService) {
    this.startDate = new Date();
    this.endDate = new Date();
    this.remoteWorkHistory = this.userService.user.remoteWorkHistory;

    this.form = new FormGroup({
      remoteWorkDaysPerWeek: new FormControl<number>(
        this.remoteWorkHistory.remoteWorkDaysPerWeek,
        [Validators.required, Validators.pattern(/[1-5]/)]
      ),
      startDate: new FormControl<Date>(this.remoteWorkHistory.startDate, [
        Validators.required,
        CustomValidatorsModule.minDateValidator(new Date(2010, 0, 1)),
      ]),
      endDate: new FormControl<Date>(this.remoteWorkHistory.endDate, [
        Validators.required,
        CustomValidatorsModule.maxDateValidator(new Date()),
      ]),
    });
  }

  ngOnInit(): void {
    this.startDate = this.remoteWorkHistory.startDate;
    this.endDate = this.remoteWorkHistory.endDate;
    this.remoteDays = this.remoteWorkHistory.remoteWorkDaysPerWeek;
  }

  ngOnDestroy() {
    const rwh: RemoteWorkhistory = this.form.value;

    this.userService.user.remoteWorkHistory.remoteWorkDaysPerWeek = rwh.remoteWorkDaysPerWeek;
    this.userService.user.remoteWorkHistory.startDate = rwh.startDate;
    this.userService.user.remoteWorkHistory.endDate = rwh.endDate;
  }
}
