import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogoutPopupComponent } from '../../components/logout-popup/logout-popup.component';
import { NavService } from './../nav.service';
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  constructor(public navService: NavService,private dialog:MatDialog,private router:Router) { }

  ngOnInit(): void {
  }

  openDialog(){
    const dialogBox = this.dialog.open(LogoutPopupComponent);

    dialogBox.afterClosed().subscribe(result => {
    if(result){
      this.router.navigate(['/']);
    }
  });

}

}



