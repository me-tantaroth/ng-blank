import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCorpayandeComponent } from './footer-corpayande.component';

describe('FooterCorpayandeComponent', () => {
  let component: FooterCorpayandeComponent;
  let fixture: ComponentFixture<FooterCorpayandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterCorpayandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterCorpayandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
