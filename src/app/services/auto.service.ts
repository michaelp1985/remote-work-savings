import { Injectable } from '@angular/core';
import { AutoType } from '../models/enumerations/auto-type';

@Injectable({
  providedIn: 'root'
})
export class AutoService {

  constructor() { }

  getMpgByAutoType(autoType: AutoType) {

    //https://afdc.energy.gov/data/10310
    switch(autoType){
      case AutoType.MotorCycle:
        return 45;
      case AutoType.Truck:
      case AutoType.Van:
      case AutoType.SUV:
        return 20;
      case AutoType.Car:        
      case AutoType.Other:
      default:
        return 25;      
    }
  }
}
