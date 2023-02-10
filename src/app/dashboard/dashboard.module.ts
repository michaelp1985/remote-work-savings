import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DashboardComponent } from './dashboard.component';
import { NgMaterialModule } from '../shared/ng-material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommuteComponent } from './components/commute/commute.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportsComponent } from './components/reports/reports.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FuelCostService } from '../services/fuel-cost.service';
import { WorkHistoryComponent } from './components/work-history/work-history.component';
import { StartComponent } from './components/start/start.component';
import { TransportationComponent } from './components/transportation/transportation.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FoodComponent } from './components/food/food.component';
import { MiscComponent } from './components/misc/misc.component';
import { ChildComponent } from './components/child/child.component';
import { SummaryComponent } from './components/summary/summary.component';
import { LocationComponent } from './components/location/location.component';
import { CustomValidatorsModule } from '../shared/validators/custom-validators.module';
import { CustomInputModule } from '../shared/custom-input/custom-input.module';
import { ReportService } from '../services/report.service';

const routes: Routes = [
  { path: '', component: DashboardComponent,
    children: [
      { path: 'reports', component: ReportsComponent },      
      { path: 'work', component: WorkHistoryComponent },
      { path: 'location', component: LocationComponent },
      { path: 'food', component: FoodComponent },
      { path: 'commute', component: CommuteComponent},
      { path: 'start', component: StartComponent},
      { path: 'transportation', component: TransportationComponent},
      { path: 'misc', component: MiscComponent },
      { path: 'child', component: ChildComponent },
      { path: 'summary', component: SummaryComponent }
    ] 
  },  
  { path: '**', redirectTo: 'reports' }
]

@NgModule({
  declarations: [      
    DashboardComponent,      
    SidenavComponent, 
    CommuteComponent, 
    ReportsComponent, 
    ToolbarComponent, 
    WorkHistoryComponent, 
    StartComponent, 
    TransportationComponent,
    NavigationComponent, 
    FoodComponent, 
    MiscComponent, 
    ChildComponent, 
    SummaryComponent, 
    LocationComponent
  ],
  imports: [
    CommonModule,
    NgMaterialModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,    
    ReactiveFormsModule,
    CustomValidatorsModule,
    CustomInputModule,
    RouterModule.forChild(routes),    
  ],  
  providers: [
    FuelCostService,
    ReportService
  ]
})
export class DashboardModule { }
