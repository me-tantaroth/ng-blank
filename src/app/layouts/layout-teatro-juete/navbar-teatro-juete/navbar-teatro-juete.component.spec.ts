import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTeatroJueteComponent } from './navbar-teatro-juete.component';

describe('NavbarTeatroJueteComponent', () => {
  let component: NavbarTeatroJueteComponent;
  let fixture: ComponentFixture<NavbarTeatroJueteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarTeatroJueteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarTeatroJueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
