import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMeetingListComponent } from './parent-meeting-list.component';

describe('ParentMeetingListComponent', () => {
  let component: ParentMeetingListComponent;
  let fixture: ComponentFixture<ParentMeetingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentMeetingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentMeetingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
