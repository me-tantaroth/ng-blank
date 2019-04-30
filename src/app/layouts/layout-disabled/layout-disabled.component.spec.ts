import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDisabledComponent } from './layout-disabled.component';

describe('LayoutDisabledComponent', () => {
  let component: LayoutDisabledComponent;
  let fixture: ComponentFixture<LayoutDisabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutDisabledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
