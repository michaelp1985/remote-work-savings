import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CustomValidatorsModule } from 'src/app/shared/validators/custom-validators.module';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
    
  hasChildCareSavings: boolean = false;
  hasSavedAdditionalCost: boolean = false;

  childCareCost: number = 0;
  childCareCommuteMinutes: number = 0;
  childCareCommuteMiles: number = 0;

  form: FormGroup;

  careCost: FormControl = new FormControl(this.userService.user.childCare.costPerWeek, [
    Validators.required,
    CustomValidatorsModule.minNumberValidator(0.1)
  ]);

  commuteMiles: FormControl = new FormControl(this.userService.user.childCare.commuteInMilesPerDay, [
    Validators.required,
    CustomValidatorsModule.minNumberValidator(1)
  ]);

  commuteMinutes: FormControl = new FormControl(this.userService.user.childCare.commuteInMinutesPerDay, [
    Validators.required,
    CustomValidatorsModule.minNumberValidator(1)
  ])

  noSelector: FormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private readonly userService: UserService) { 
    this.form = new FormGroup({});
    this.form.addControl('noSelector', this.noSelector);
  }

  ngOnInit(): void {
    this.childCareCost = this.userService.user.childCare.costPerWeek ?? 0;
    this.childCareCommuteMiles = this.userService.user.childCare.commuteInMilesPerDay ?? 0;
    this.childCareCommuteMinutes = this.userService.user.childCare.commuteInMinutesPerDay ?? 0;
  }

  hasSavedOnChildCare(hasSaved: boolean) {
    
    if (this.hasChildCareSavings != hasSaved){
      this.hasChildCareSavings = hasSaved; 
      this.noSelector.setValue(null);  
    
      if(this.hasChildCareSavings){
        this.form.addControl('careCost', this.careCost);
      } else {
        this.form.removeControl('careCost');
        this.childCareCost = 0;
      }
    }

    if (!hasSaved) {
      this.noSelector.setValue(true);
    }
  }

  needToAddCostSavings(additionalCost: boolean) {      

    if (this.hasSavedAdditionalCost != additionalCost){
      this.hasSavedAdditionalCost = additionalCost;  

      if (additionalCost) {
        this.form.addControl('commuteMiles', this.commuteMiles);
        this.form.addControl('commuteMinutes', this.commuteMinutes);
      } else {
        this.form.removeControl('commuteMiles');
        this.form.removeControl('commuteMinutes');
        this.childCareCommuteMiles = 0;
        this.childCareCommuteMinutes = 0;
      }
    }

    this.noSelector.setValue(true);
  }

  ngOnDestroy() {
    this.userService.user.childCare.costPerWeek = this.childCareCost;
    this.userService.user.childCare.commuteInMilesPerDay = this.childCareCommuteMiles;
    this.userService.user.childCare.commuteInMinutesPerDay = this.childCareCommuteMinutes;
  }
}
