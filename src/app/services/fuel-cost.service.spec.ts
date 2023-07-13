import {
  HttpClient,
  HttpClientModule,  
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FuelType } from '../models/fuel-type';
import { Fuel } from '../models/fuel.model';
import { FuelCostService } from './fuel-cost.service';
import { ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';

describe('FuelCostService', () => {
  let service: FuelCostService;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  httpClientSpy.get.and.returnValue(of([]));
  const token = 'token';
  const recaptchaV3ServiceSpy = jasmine.createSpyObj('ReCaptchaV3Service', [
    'execute',
  ]);
  recaptchaV3ServiceSpy.execute.and.returnValue(of(token));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RecaptchaV3Module],
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientSpy,
        },
        {
          provide: ReCaptchaV3Service,
          useValue: recaptchaV3ServiceSpy,
        },
      ],
    });
    service = TestBed.inject(FuelCostService);
  });

  describe('Verify Service', () => {
    it('Fuel Cost Service should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getFuelDataByFuelType', () => {
    it('should return the fuel data by fuel type', () => {
      const mockFuelData: Fuel[] = [
        {
          'area-name': 'test',
          'process-name': 'test',
          'product-name': 'mock test product',
          'series-description': 'test',
          period: 'test',
          value: 1,
          duoarea: 'test',
        },
      ];

      let mockResponse: any = {
        response: {
          data: mockFuelData,
        },
      };

      service.populateFuelDataHandler(mockResponse);

      const fuelData = service.getFuelDataByFuelType('mock test product');
      expect(fuelData).toBeDefined();
      expect(fuelData[0]['product-name']).toBe('mock test product');
    });
  });

  describe('getfuelTypes', () => {
    it('should return a list of fuel types that contains the Regular Gasoline fuel type', () => {
      const expectedFuelType: FuelType = {
        name: 'Regular',
        value: 'Regular Gasoline',
      };

      const fuelTypes = service.getfuelTypes();

      expect(fuelTypes).toBeDefined();
      expect(fuelTypes).toContain(expectedFuelType);
    });
  });

  describe('loadFuelData', () => {
    it('should load fuel types from epi api', () => {
      const mockFuelData: Fuel[] = [
        {
          'area-name': 'test',
          'process-name': 'test',
          'product-name': 'mock test product',
          'series-description': 'test',
          period: 'test',
          value: 1,
          duoarea: 'test',
        },
      ];

      let mockResponse: any = {
        response: {
          data: mockFuelData,
        },
      };

      httpClientSpy.get.and.returnValue(of(mockResponse));

      const area = 'test';
      const startDate = new Date(2020, 0, 1);
      const endDate = new Date(2021, 0, 1);

      service.loadFuelData(area, startDate, endDate);

      const fuelData = service.fuelData;

      expect(fuelData).toBeTruthy();
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });
  });
});
