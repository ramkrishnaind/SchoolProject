import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
  }
  back(){
    this.route.navigate(['/dashboard']);
  }

}
