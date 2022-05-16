import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackbar: MatSnackBar
) { }

ngOnInit() {}

get getIcon() {
    switch (this.data.snackType) {
        case 'Done':
            return 'done';
        case 'Warning':
            return 'Warning';
    }
}

closeSnackbar() {
    this.snackbar.dismiss();
}

}
