import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutoType } from 'src/app/models/enumerations/auto-type';
import { TransportationType } from 'src/app/models/enumerations/transportation-type';
import { FuelType } from 'src/app/models/fuel-type';
import { FuelCostService } from 'src/app/services/fuel-cost.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidatorsModule } from 'src/app/shared/validators/custom-validators.module';

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.scss'],
})
export class TransportationComponent implements OnInit {
  readonly TransportationType = TransportationType;
  readonly AutoType = AutoType;
  transportationTypes: string[] = [];
  selectedTransportation: string = '';
  autoTypes: string[] = [];
  selectedAuto: string = '';
  fuelTypes: FuelType[] = [];
  selectedFuel: string = '';
  minutesToWork: string = '';
  milesToWork: number = 0;
  publicTransportationCost: string = '';

  autoType: FormControl = new FormControl(
    this.userService.user.commute.autoType,
    [Validators.required]
  );

  fuelType: FormControl = new FormControl(
    this.userService.user.commute.fuelType,
    [Validators.required]
  );

  distanceToWork: FormControl = new FormControl(
    this.userService.user.commute.commuteDistancePerDay,
    [Validators.required, CustomValidatorsModule.minNumberValidator(1)]
  );

  publicCost: FormControl = new FormControl(
    this.userService.user.commute.publicTransportationCostPerDay,
    [Validators.required, CustomValidatorsModule.minNumberValidator(0.01)]
  );

  transportationMode: FormControl = new FormControl(
    this.userService.user.commute.transportationType,
    [Validators.required]
  );

  timeToWork: FormControl = new FormControl(
    this.userService.user.commute.commuteMinutesPerDay,
    [Validators.required, CustomValidatorsModule.minNumberValidator(1)]
  );

  form: FormGroup;

  constructor(
    private readonly userService: UserService,
    private readonly fuelService: FuelCostService
  ) {
    this.form = new FormGroup({});

    this.form.addControl('transportationMode', this.transportationMode);
    this.form.addControl('timeToWork', this.timeToWork);
  }

  ngOnInit(): void {
    this.populateSelectFields();

    this.selectedAuto = this.userService.user.commute.autoType ?? '';
    this.selectedFuel = this.userService.user.commute.fuelType ?? '';
    this.selectedTransportation =
      this.userService.user.commute.transportationType ?? '';
    this.milesToWork = this.userService.user.commute.commuteDistancePerDay;
    this.minutesToWork =
      this.userService.user.commute.commuteMinutesPerDay.toString();
    this.publicTransportationCost =
      this.userService.user.commute.publicTransportationCostPerDay?.toString() ??
      '';
  }

  toggleFormControls(transportationType: TransportationType) {
    // - remove non default fields
    Object.keys(this.form.controls).forEach((key) => {
      if (key !== 'transportationMode' && key !== 'timeToWork') {
        this.form.removeControl(key);
      }
    });

    this.form.addControl('transportationMode', this.transportationMode);
    this.form.addControl('timeToWork', this.timeToWork);

    switch (transportationType) {
      case TransportationType.public:
        this.form.addControl('publicCost', this.publicCost);
        break;
      case TransportationType.personalMoto:
        this.form.addControl('autoType', this.autoType);
        this.form.addControl('fuelType', this.fuelType);
        this.form.addControl('distanceToWork', this.distanceToWork);
        break;
      case TransportationType.personalNonMoto:
      case TransportationType.other:
        break;
    }
  }

  private populateSelectFields() {
    this.fuelTypes = this.fuelService.getfuelTypes();

    this.autoTypes.push(AutoType.Car);
    this.autoTypes.push(AutoType.Truck);
    this.autoTypes.push(AutoType.SUV);
    this.autoTypes.push(AutoType.Van);
    this.autoTypes.push(AutoType.MotorCycle);

    this.transportationTypes.push(TransportationType.personalMoto);
    this.transportationTypes.push(TransportationType.personalNonMoto);
    this.transportationTypes.push(TransportationType.public);
    this.transportationTypes.push(TransportationType.other);
  }

  ngOnDestroy() {
    this.userService.user.commute.autoType = <AutoType>this.selectedAuto;
    this.userService.user.commute.fuelType = this.selectedFuel;
    this.userService.user.commute.transportationType =
      this.selectedTransportation;
    this.userService.user.commute.commuteDistancePerDay = this.milesToWork;
    this.userService.user.commute.commuteMinutesPerDay =
      parseInt(this.minutesToWork) * 2;
    this.userService.user.commute.publicTransportationCostPerDay = parseFloat(
      this.publicTransportationCost.replace('$', '')
    );
    this.userService.populateFuelData();
  }
}
