import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCorpayandeComponent } from './navbar-corpayande.component';

describe('NavbarCorpayandeComponent', () => {
  let component: NavbarCorpayandeComponent;
  let fixture: ComponentFixture<NavbarCorpayandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarCorpayandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCorpayandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
