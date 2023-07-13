import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: ` <app-sidenav></app-sidenav> `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  constructor(private readonly route: Router) {}

  ngOnInit(): void {
    this.route.navigate(['dashboard', 'start']);
  }
}
