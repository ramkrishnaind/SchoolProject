import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParentDetailComponent } from './add-parent-detail.component';

describe('AddParentDetailComponent', () => {
  let component: AddParentDetailComponent;
  let fixture: ComponentFixture<AddParentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddParentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
