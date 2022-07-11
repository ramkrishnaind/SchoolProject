import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherLinkComponent } from './teacher-link.component';

describe('TeacherLinkComponent', () => {
  let component: TeacherLinkComponent;
  let fixture: ComponentFixture<TeacherLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
