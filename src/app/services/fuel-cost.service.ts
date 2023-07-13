import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fuel } from '../models/fuel.model';
import { FuelType } from '../models/fuel-type';
import FuelData from '../../assets/fuel.json';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AutoService } from './auto.service';
import { AutoType } from '../models/enumerations/auto-type';

@Injectable({
  providedIn: 'root',
})
export class FuelCostService {
  private _fuleData: BehaviorSubject<Fuel[]>;
  private _fuelTypeData: FuelType[] = FuelData;

  private dataStore: {
    fuleData: Fuel[];
  };

  constructor(
    private http: HttpClient,
    private recaptchaV3Service: ReCaptchaV3Service,
    private readonly autoService: AutoService
  ) {
    this._fuleData = new BehaviorSubject<Fuel[]>([]);
    this.dataStore = { fuleData: [] };
  }

  getFuelDataByFuelType(fuelType: string) {
    return this.dataStore.fuleData.filter((x) => x['product-name'] == fuelType);
  }

  get fuelData(): Observable<Fuel[]> {
    return this._fuleData.asObservable();
  }

  getfuelTypes(): FuelType[] {
    return this._fuelTypeData;
  }

  getDefaultMpgByAutoType(autoType: AutoType) {
    return this.autoService.getMpgByAutoType(autoType);
  }

  loadFuelData(area: string, startDate: Date, endDate: Date) {
    let startDateString = `${startDate.getFullYear()}-${(
      '0' +
      (startDate.getMonth() + 1)
    ).slice(-2)}`;
    let endDateString = `${endDate.getFullYear()}-${(
      '0' +
      (startDate.getMonth() + 1)
    ).slice(-2)}`;

    console.log('Loading Fuel Data...');

    this.recaptchaV3Service.execute('action').subscribe((token) => {      

      let energyApiUrl = `https://us-central1-remote-work-history-fc52c.cloudfunctions.net/api?area=${area}&startDate=${startDateString}&endDate=${endDateString}`;

      const headers = new HttpHeaders({ 'x-firebase-appcheck': token });

      this.http.get<Fuel[]>(energyApiUrl, { headers }).subscribe({
        next: (data) => this.populateFuelDataHandler(data),
        error: (err) => this.ErrorHandler(err),
        complete: () => this.CompletedHandler('fuel data loaded'),
      });
    });
  }

  populateFuelDataHandler(fuelData: any) {
    let data: any[] = fuelData.response.data;
    console.log(data);
    this.dataStore.fuleData = data.map((d) => {
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

  ErrorHandler(error: any) {
    console.log(error);
  }

  CompletedHandler(message: string) {
    console.log(message);
  }
}
