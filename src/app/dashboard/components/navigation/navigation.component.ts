import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, AfterViewInit {
  static currentPage: number = 0;
  @Input() shownext = false;
  @Input() showprevious = false;
  showStart = false;  
  startButtonText = 'Get Started!';

  pageNaviagtion = [
    'start',
    'work',
    'work-holidays',
    'location',
    'transportation',
    'food',
    'child',
    'misc',
    'summary',
    'reports',
  ];
  lastPage: number;

  constructor(private router: Router) {
    this.lastPage = this.pageNaviagtion.length - 1;
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  ngOnInit(): void {
    let currentPage = this.getCurrentPageName();
    this.showStart = currentPage === 'start' || currentPage === 'reports';    

    if (currentPage === 'reports') {
      this.startButtonText = 'Restart Process';
    }
  }

  start() {
    let currentPage = this.getCurrentPageName();
    NavigationComponent.currentPage = (currentPage === 'reports') ? 0 : 1;
    let nextPage = '/' + this.pageNaviagtion[NavigationComponent.currentPage];
    this.router.navigate([nextPage]);
  }

  previous() {
    let page = this.getCurrentPageName();
    NavigationComponent.currentPage = this.pageNaviagtion.indexOf(page) - 1;
    let previousPage =
      '/' + this.pageNaviagtion[NavigationComponent.currentPage];
    this.router.navigate([previousPage]);
  }

  next() {
    let page = this.getCurrentPageName();
    NavigationComponent.currentPage = this.pageNaviagtion.indexOf(page) + 1;
    let nextPage = '/' + this.pageNaviagtion[NavigationComponent.currentPage];
    this.router.navigate([nextPage]);
  }

  getCurrentPageName() {
    return this.router.url.split('/').pop() ?? '';
  }

  public get currentPage(): number {
    return NavigationComponent.currentPage;
  }

  scrollToTop() {
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
}
