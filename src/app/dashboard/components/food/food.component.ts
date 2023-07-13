import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CustomValidatorsModule } from 'src/app/shared/validators/custom-validators.module';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss'],
})
export class FoodComponent implements OnInit {
  foodCostPerWeek: number = 0;
  beverageCostPerWeek: number = 0;

  form: FormGroup;

  foodCostControl: FormControl = new FormControl(
    this.userService.user.misc.foodCostPerWeek,
    [CustomValidatorsModule.numericValidator()]
  );

  beverageCostControl: FormControl = new FormControl(
    this.userService.user.misc.beverageCostPerWeek,
    [CustomValidatorsModule.numericValidator()]
  );

  constructor(private readonly userService: UserService) {
    this.form = new FormGroup({});

    this.form.addControl('foodCostControl', this.foodCostControl);
    this.form.addControl('beverageCostControl', this.beverageCostControl);
  }

  ngOnInit(): void {
    this.beverageCostPerWeek = this.userService.user.misc.beverageCostPerWeek;
    this.foodCostPerWeek = this.userService.user.misc.foodCostPerWeek;
  }

  ngOnDestroy() {
    this.userService.user.misc.foodCostPerWeek = parseFloat(
      this.foodCostPerWeek.toString().replace('$', '')
    );
    this.userService.user.misc.beverageCostPerWeek = parseFloat(
      this.beverageCostPerWeek.toString().replace('$', '')
    );
  }
}
