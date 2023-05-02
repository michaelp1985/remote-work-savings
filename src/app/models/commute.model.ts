import { AutoType } from "./enumerations/auto-type";

export class Commute {
    transportationType: string = '';
    commuteMinutesPerDay: number = 0; 
    commuteDistancePerDay: number = 0;
    autoType: string = '';
    fuelType: string = '';        
    publicTransportationCostPerDay?: number;
    
    insuranceSavingsPerMonth?: number;
    oilChangeCost!: number;
    tireSize?: number;   
}
