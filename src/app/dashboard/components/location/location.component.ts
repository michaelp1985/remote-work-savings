import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { City } from 'src/app/models/city.model';
import { State } from 'src/app/models/state.model';
import { LocationService } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  states: State[] = [];
  cities: City[] = [];
  selectedState: State;
  selectedCity: City;
  formComplete = false;

  form: FormGroup;

  state: FormControl = new FormControl('', [Validators.required]);

  city: FormControl = new FormControl(this.userService.user.city, [
    Validators.required,
  ]);

  constructor(
    private readonly locationService: LocationService,
    private readonly userService: UserService
  ) {
    this.selectedState = new State();
    this.selectedCity = new City();

    this.form = new FormGroup({});
    this.form.addControl('state', this.state);
    this.formComplete = this.form.valid;
  }

  ngOnInit(): void {
    this.states = this.locationService.getStates();

    if (this.userService.user.state) {
      const state = this.states.find(
        (state) =>
          state.abbreviation === this.userService.user.state.abbreviation
      );

      if (state) {
        this.selectedState = state;

        this.onStateChange(this.selectedState);

        if (this.userService.user.city) {
          const city = this.cities.find(
            (city) => city.name === this.userService.user.city?.name
          );

          if (city) {
            this.selectedCity = city;
            this.onCityChange(this.selectedCity);
          }
        }
      }
    }
  }

  onStateChange(state: State) {
    this.userService.user.state = state;
    this.populateCities(state);

    if (this.cities.length <= 1) {
      if (this.form.contains('city')) {
        this.form.removeControl('city');
      }

      this.formComplete = true;
    } else {
      this.form.addControl('city', this.city);
      this.formComplete = false;
    }
  }

  onCityChange(city: City) {
    this.userService.user.city = city;
    this.formComplete = true;
  }

  private populateCities(state: State) {
    this.cities = this.locationService.getCitiesByStateAbbreviation(
      state.abbreviation
    );

    this.cities.push({
      name: 'Other',
      area: '',
    });
  }
}
