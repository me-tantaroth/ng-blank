import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPijaosCaciquesComponent } from './navbar-pijaoscaciques.component';

describe('NavbarPijaosCaciquesComponent', () => {
  let component: NavbarPijaosCaciquesComponent;
  let fixture: ComponentFixture<NavbarPijaosCaciquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarPijaosCaciquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarPijaosCaciquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
