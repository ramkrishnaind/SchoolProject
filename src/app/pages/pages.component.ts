import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { NavItem } from './theme/nav-item';
import { NavService } from './theme/nav.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagesComponent implements AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;

  
  navItems: NavItem[] = [
    {
      displayName: 'Dashboard',
      route: '/pages/dashboard',
      iconClass: 'ic-dashboard'
    },
    {
      displayName: 'Master',
      route: '',
      iconClass: 'ic-catalogue-mang',
      children: [
        {
          displayName: 'Parent',
          route: '/pages/master/parent',
          iconClass: 'ic-vertical'
        },
        {
          displayName: 'Standred',
          route: '/pages/master/standard',
          iconClass: 'ic-category-man'
        },
        {
          displayName: 'Division',
          route: '/pages/master/division',
          iconClass: 'ic-category-man'
        },
        {
          displayName: 'Subject',
          route: '/pages/master/subject',
          iconClass: 'ic-category-man'
        },
        {
          displayName: 'Location',
          route: '/pages/master/location',
          iconClass: 'ic-category-man'
        },
      
      ]
    },
    // {
    //   displayName: 'Payment',
    //   route: '/payment',
    //   iconClass: 'ic-business-reports'
    // },
    // {
    //   displayName: 'Chat',
    //   route: '/chat',
    //   iconClass: 'ic-business-profile'
    // },
    // {
    //   displayName: 'Analytics',
    //   route: '',
    //   iconClass: 'ic-requestes',
    //   children: [
    //     {
    //       displayName: 'Chat Analytics',
    //       route: '/analytics',
    //       iconClass: 'ic-vertical'
    //     },
    //     {
    //       displayName: 'Product Analytics',
    //       route: '/analytics/product',
    //       iconClass: 'ic-category-man'
    //     },
      
    //   ]
    // },
   
  ];
  screenWidth: number;

  constructor(private navService: NavService) {
  }
  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

}
