import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamtimetableComponent } from './examtimetable.component';

describe('ExamtimetableComponent', () => {
  let component: ExamtimetableComponent;
  let fixture: ComponentFixture<ExamtimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamtimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamtimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
