import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherLinkListComponent } from './teacher-link-list.component';

describe('TeacherLinkListComponent', () => {
  let component: TeacherLinkListComponent;
  let fixture: ComponentFixture<TeacherLinkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherLinkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
