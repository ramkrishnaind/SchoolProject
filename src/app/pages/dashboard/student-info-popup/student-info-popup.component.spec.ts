import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInfoPopupComponent } from './student-info-popup.component';

describe('StudentInfoPopupComponent', () => {
  let component: StudentInfoPopupComponent;
  let fixture: ComponentFixture<StudentInfoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentInfoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
