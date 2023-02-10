import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  static currentPage: number = 0;
  @Input() shownext = false;

  pageNaviagtion = ['start', 'work', 'location', 'transportation', 'food', 'child', 'misc', 'summary'];
  lastPage: number;

  constructor(private router: Router) {    
    this.lastPage = this.pageNaviagtion.length - 1;
   }

  ngOnInit(): void {    
  }

  previous() {    
    let page = this.getCurrentPageName();
    NavigationComponent.currentPage = this.pageNaviagtion.indexOf(page) - 1;
    let previousPage = '/' + this.pageNaviagtion[NavigationComponent.currentPage];
    this.router.navigate([previousPage]);
  }

  next() {
    let page = this.getCurrentPageName();
    NavigationComponent.currentPage = this.pageNaviagtion.indexOf(page) + 1;
    let nextPage = '/' + this.pageNaviagtion[NavigationComponent.currentPage];
    this.router.navigate([nextPage]);    
  }

  getCurrentPageName(){
    return this.router.url.split('/').pop() ?? "";
  }
  
  public get currentPage() : number {
    return NavigationComponent.currentPage;
  }  
}
