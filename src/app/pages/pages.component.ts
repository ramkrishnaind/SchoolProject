import { Component, OnInit, ViewChild, HostListener, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
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
          iconClass: 'ic-cust-app-tra'
        },
        {
          displayName: 'Standard',
          route: '/pages/master/standard',
          iconClass: 'ic-support-request'
        },
        {
          displayName: 'Division',
          route: '/pages/master/division',
          iconClass: 'ic-user-mana'
        },
        {
          displayName: 'Subject',
          route: '/pages/master/subject',
          iconClass: 'ic-business-reports'
        },
        // {
        //   displayName: 'Location',
        //   route: '/pages/master/location',
        //   iconClass: 'ic-sub-category'
        // },
        {
          displayName: 'Teacher',
          route: '/pages/master/teacher',
          iconClass: 'ic-cust-app-tra'
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
