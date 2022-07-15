import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageBarComponent } from './message-bar/message-bar.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  apiCall = 0;
  apiResponse = 0;
 
  redirectUrl = '';
  constructor(
    private activatedRoute: ActivatedRoute, private snackbar: MatSnackBar,private dialog: MatDialog) {
    
  }
 

  openSnackbar(message: string, type: string) {
    this.snackbar.openFromComponent(MessageBarComponent, {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        data: { message: message, snackType: type }
    });
  }
  openDialog(popupTitle:string,message:string){
  const dialogRef = this.dialog.open(PopupComponent,{
    data:{
      title:popupTitle,
      message:message
    }
  });

  return dialogRef;
  }
}
