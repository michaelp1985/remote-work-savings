import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CustomValidatorsModule } from 'src/app/shared/validators/custom-validators.module';

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.scss'],
})
export class MiscComponent implements OnInit {
  clothingCost: number = 0;
  gettingReadyTimeInMinutes: number = 0;

  clothingCostPerYear: FormControl = new FormControl(
    this.userService.user.misc.clothingCostPerYear,
    [CustomValidatorsModule.numericValidator()]
  );

  morningRoutineInMinutes: FormControl = new FormControl(
    this.userService.user.misc.morningRoutineInMinutes,
    [CustomValidatorsModule.numericValidator()]
  );

  form: FormGroup;

  constructor(private readonly userService: UserService) {
    this.form = new FormGroup({});

    this.form.addControl('clothingCostPerYear', this.clothingCostPerYear);

    this.form.addControl(
      'morningRoutineInMinutes',
      this.morningRoutineInMinutes
    );
  }

  ngOnInit(): void {
    this.clothingCost = this.userService.user.misc.clothingCostPerYear;
    this.gettingReadyTimeInMinutes =
      this.userService.user.misc.morningRoutineInMinutes;
  }

  ngOnDestroy() {
    this.userService.user.misc.clothingCostPerYear = parseFloat(
      this.clothingCost.toString().replace('$', '')
    );
    this.userService.user.misc.morningRoutineInMinutes = parseInt(
      this.gettingReadyTimeInMinutes.toString()
    );
  }
}
