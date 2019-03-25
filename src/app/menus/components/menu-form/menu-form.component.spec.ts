import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenunFormComponent } from './menu-form.component';

describe('MenunFormComponent', () => {
  let component: MenunFormComponent;
  let fixture: ComponentFixture<MenunFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenunFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenunFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
