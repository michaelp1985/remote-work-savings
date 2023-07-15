import { TestBed } from '@angular/core/testing';
import { ReportService } from './report.service';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Commute } from '../models/commute.model';
import { ChildCare } from '../models/child-care';
import { Misc } from '../models/misc';
import { State } from '../models/state.model';

describe('ReportService', () => {
  let service: ReportService;

  let u: User = {
    remoteWorkHistory: {
      endDate: new Date(2020, 1, 1),
      startDate: new Date(2021, 1, 1),
      remoteWorkDaysPerWeek: 3,
      holidayCountPerYear: 6,
    },
    commute: new Commute(),
    childCare: new ChildCare(),
    misc: new Misc(),
    state: new State(),
  };

  const userServiceSpy = jasmine.createSpyObj(
    'UserService',
    [
      'getTotalChildCareTimeSaved',
      'getTotalCommuteTimeSaved',
      'getTotalMorningRoutineTimeSaved',
      'getTotalDaysWorkedRemote',
      'populateTimeData',
      'getTotalFoodBeverageCost',
      'getTotalMiscSavings',
      'getTotalFuelSavings',
      'getTotalChildCareSavings',
    ],
    { user: u }
  );

  userServiceSpy.getTotalChildCareTimeSaved.and.returnValue(100);
  userServiceSpy.getTotalCommuteTimeSaved.and.returnValue(1000);
  userServiceSpy.getTotalMorningRoutineTimeSaved.and.returnValue(300);
  userServiceSpy.getTotalDaysWorkedRemote.and.returnValue(200);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: userServiceSpy,
        },
      ],
    });

    service = TestBed.inject(ReportService);
  });

  describe('Verify Service', () => {
    it('Report service should be defined', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getUserTimeSavingsBreakdownReport', () => {
    it('should return an array of TimeSavingsReport', () => {
      const result = service.getUserTimeSavingsBreakdownReport();
      expect(result).toBeTruthy();
    });
  });
});
