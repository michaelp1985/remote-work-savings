import { TestBed } from '@angular/core/testing';
import { AutoType } from '../models/enumerations/auto-type';
import { AutoService } from "./auto.service";

describe("AutoService", () => {
  let service: AutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoService);
  });

  describe('Verify Service', () => {
    it('Auto service should be defined', () => {
      expect(service).toBeDefined();
    })
  })

  describe('getMpgByAutoType', () => {
    it('should get miles per gallon for Car', () => {
      
      const mpg = service.getMpgByAutoType(AutoType.Car);

      expect(mpg).toBe(25);
    });

    it('should get miles per gallon for Truck', () => {
      
      const mpg = service.getMpgByAutoType(AutoType.Truck);

      expect(mpg).toBe(20);
    });

    it('should get miles per gallon for Motorcycle', () => {
      
      const mpg = service.getMpgByAutoType(AutoType.MotorCycle);

      expect(mpg).toBe(45);
    });
  });
});
