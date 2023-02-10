import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Fuel } from 'src/app/models/fuel.model';
import { FuelCostService } from 'src/app/services/fuel-cost.service';

@Component({
  selector: 'app-commute',
  templateUrl: './commute.component.html',
  styleUrls: ['./commute.component.css']
})
export class CommuteComponent implements OnInit, AfterViewInit {

  // tire size - cost to replace
  // savings on insurance 
  formComplete = false;
  displayedColumns: string[] = ['period', 'product', 'cost'];
  fuelDataSource: MatTableDataSource<Fuel>;
  fuelDataReport: Fuel[] = [];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  
  constructor(private fuelCostService: FuelCostService) { 
    this.fuelDataSource = new MatTableDataSource();        
  }
  ngAfterViewInit(): void {
    this.fuelDataSource.paginator = this.paginator ?? null;
  }

  ngOnInit(): void {
    console.log("loading");
    this.fuelCostService.fuelData.subscribe(data => {
      if (data.length == 0) return;
      this.fuelDataSource = new MatTableDataSource<Fuel>(data);
      this.fuelDataReport.push(...data);
    });    
  }
}
