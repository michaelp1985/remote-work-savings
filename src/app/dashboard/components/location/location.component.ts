import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { City } from 'src/app/models/city.model';
import { State } from 'src/app/models/state.model';
import { LocationService } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  states: State[] = [];
  cities: City[] = [];
  selectedState: State;
  selectedCity: City;  
  formComplete = false;

  form = new FormGroup({
    state: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private readonly locationService: LocationService,
    private readonly userService: UserService) {
    this.selectedState = new State();
    this.selectedCity = new City();    

    this.formComplete = this.form.valid;
  }  

  ngOnInit(): void {
    console.log(JSON.stringify(this.userService.user.remoteWorkHistory));
    this.states = this.locationService.getStates();  
    
    if (this.userService.user.state){
      this.selectedState = this.userService.user.state;            

      if (this.userService.user.city){
        this.selectedCity = this.userService.user.city;
      }
    }
  }

  onStateChange(state: State){    
    this.userService.user.state = state;   
    this.cities = this.locationService.getCitiesByStateAbbreviation(state.abbreviation);  
    this.cities.push({
      name: "Other",
      area: ""
    });    
    
    if (this.cities.length <= 1)
      this.formComplete = true;
    else
      this.formComplete = false;
  }

  onCityChange(city: City) {
    this.userService.user.city = city;
    this.formComplete = true;
  }
}
