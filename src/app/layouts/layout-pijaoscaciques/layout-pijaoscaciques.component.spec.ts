import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPijaosCaciquesComponent } from './layout-pijaoscaciques.component';

describe('LayoutCorpayandeComponent', () => {
  let component: LayoutPijaosCaciquesComponent;
  let fixture: ComponentFixture<LayoutPijaosCaciquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutPijaosCaciquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutPijaosCaciquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
