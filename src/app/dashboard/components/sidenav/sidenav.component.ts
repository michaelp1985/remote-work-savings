import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  public isScreenSmall: boolean;

  @ViewChild(MatSidenav) sidenav?: MatSidenav; 

  constructor(
    private breakpointObserver: BreakpointObserver,    
    private router: Router
    ) { 
      this.isScreenSmall = true;
    }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
      .subscribe((state: BreakpointState) => {
        this.isScreenSmall = state.matches;
      });        
    
    this.router.events.subscribe(() => {
      if (this.isScreenSmall) {
        this.sidenav?.close();
      }
    })
  }

}
