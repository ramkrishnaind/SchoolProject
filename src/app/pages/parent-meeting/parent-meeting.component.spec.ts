import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMeetingComponent } from './parent-meeting.component';

describe('ParentMeetingComponent', () => {
  let component: ParentMeetingComponent;
  let fixture: ComponentFixture<ParentMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
