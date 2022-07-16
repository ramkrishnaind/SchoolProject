import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeacherRecordComponent } from './add-teacher-record.component';

describe('AddTeacherRecordComponent', () => {
  let component: AddTeacherRecordComponent;
  let fixture: ComponentFixture<AddTeacherRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeacherRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeacherRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
