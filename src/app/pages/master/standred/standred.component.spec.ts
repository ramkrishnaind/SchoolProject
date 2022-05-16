import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandredComponent } from './standred.component';

describe('StandredComponent', () => {
  let component: StandredComponent;
  let fixture: ComponentFixture<StandredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
