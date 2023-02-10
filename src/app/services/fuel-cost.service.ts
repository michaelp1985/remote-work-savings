import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fuel } from '../models/fuel.model';
import { FuelType } from '../models/fuel-type';

@Injectable({
  providedIn: 'root'
})
export class FuelCostService{

  private _fuelTypeData = `[{"name":"Regular","value":"Regular Gasoline"},{"name":"Midgrade","value":"Midgrade Gasoline"},{"name":"Premium","value":"Premium Gasoline"},{"name":"Diesel","value":"No 2 Diesel"},{"name":"Other","value":"Total Gasoline"}]`;
  private _fuleData: BehaviorSubject<Fuel[]>;

  private dataStore: {
    fuleData: Fuel[];
  }

  constructor(private http: HttpClient) {
    this._fuleData = new BehaviorSubject<Fuel[]>([]);
    this.dataStore = { fuleData: [] };
   }
  
  getFuelDataByFuelType(fuelType: string){    
    return this.dataStore.fuleData.filter(x => x['product-name'] == fuelType);    
  }

  get fuelData(): Observable<Fuel[]> {
    return this._fuleData.asObservable();
  }

  getfuelTypes(): FuelType[] {
    return JSON.parse(this._fuelTypeData);
  }

  loadFuelData(area: string, startDate: Date, endDate: Date){
    
    let startDateString = `${startDate.getFullYear()}-${("0" + (startDate.getMonth() + 1)).slice(-2)}`;
    let endDateString = `${endDate.getFullYear()}-${("0" + (startDate.getMonth() + 1)).slice(-2)}`;
    let apiKey = '';
    const epiUrl = `https://api.eia.gov/v2/petroleum/pri/gnd/data/?frequency=monthly&facets[duoarea][]=${area}&data[]=value&start=${startDateString}&end=${endDateString}&sort[0][column]=period&sort[0][direction]=desc&api_key=${apiKey}`;
    
    console.log("Loading Fuel Data...");

    this.http.get<Fuel[]>(epiUrl)
    .subscribe({
      next: (data) => this.populateFuelDataHandler(data),
      error: (err) => this.ErrorHandler(err),
      complete: () => this.CompletedHandler("fuel data loaded")
    });     
  }

  populateFuelDataHandler(fuelData: any){
    let data: any[] = fuelData.response.data;    

    this.dataStore.fuleData = data.map(d => {
      let fd = new Fuel();
      fd.duoarea = d.duoarea;
      fd.period = d.period;
      fd.value = d.value;
      fd['area-name'] = d['area-name'];
      fd['product-name'] = d['product-name'];
      fd['process-name'] = d['process-name'];
      fd['series-description'] = d['series-description'];
      return fd;
    });

    this._fuleData.next(Object.assign({}, this.dataStore).fuleData);    
  }

  ErrorHandler(error: any){
    console.log(error);
  }

  CompletedHandler(message: string){
    console.log(message);
  }
}
