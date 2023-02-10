import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <app-sidenav></app-sidenav>
  `,
  styles: [
  ]
})
export class DashboardComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

}
