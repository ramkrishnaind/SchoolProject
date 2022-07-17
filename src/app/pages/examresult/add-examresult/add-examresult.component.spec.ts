import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExamresultComponent } from './add-examresult.component';

describe('AddExamresultComponent', () => {
  let component: AddExamresultComponent;
  let fixture: ComponentFixture<AddExamresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExamresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExamresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
