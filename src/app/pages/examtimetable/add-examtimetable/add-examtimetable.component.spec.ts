import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExamtimetableComponent } from './add-examtimetable.component';

describe('AddExamtimetableComponent', () => {
  let component: AddExamtimetableComponent;
  let fixture: ComponentFixture<AddExamtimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExamtimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExamtimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
