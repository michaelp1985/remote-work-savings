import { TestBed } from '@angular/core/testing';
import { LocationService } from "./location.service";

describe("LocationService", () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  describe('Verify Service', () => {
    it('Location Service should be defined.', () => {
      expect(service).toBeDefined();
    });
  })

  describe('getStates', () => {
    it('should return list of states in the US.', () => {
      const states = service.getStates();
      expect(states.length).toBe(50);
    });

    it('should have states with the name and abbreviation', () => {
      const state = service.getStates()[0];

      expect(state.abbreviation).toBeDefined();
      expect(state.name).toBeDefined();
    })
  });

  describe('getCitiesByStateAbbreviation', () => {
    it('should return the cities for a state by the states abbreviation', () => {
      const stateAbbreviation = 'CA'; 

      const cities = service.getCitiesByStateAbbreviation(stateAbbreviation);

      expect(cities).toBeDefined();
      expect(cities[0].name).toBeDefined();
    })
  })
});
