import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParentMeetComponent } from './add-parent-meet.component';

describe('AddParentMeetComponent', () => {
  let component: AddParentMeetComponent;
  let fixture: ComponentFixture<AddParentMeetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddParentMeetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParentMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
