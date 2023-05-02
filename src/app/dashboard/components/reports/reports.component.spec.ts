import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgMaterialModule } from 'src/app/shared/ng-material-module.module';

import { ReportsComponent } from './reports.component';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service } from 'ng-recaptcha';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      imports: [NgxChartsModule, NgMaterialModule, BrowserAnimationsModule],
      providers: [
        HttpClient,
        HttpHandler,
        ReCaptchaV3Service,
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: 'test',
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });  
});
