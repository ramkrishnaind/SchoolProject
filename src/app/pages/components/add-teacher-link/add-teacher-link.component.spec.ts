import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeacherLinkComponent } from './add-teacher-link.component';

describe('AddTeacherLinkComponent', () => {
  let component: AddTeacherLinkComponent;
  let fixture: ComponentFixture<AddTeacherLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeacherLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeacherLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
