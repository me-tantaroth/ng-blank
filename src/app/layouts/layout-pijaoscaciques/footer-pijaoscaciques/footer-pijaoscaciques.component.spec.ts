import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPijaosCaciquesComponent } from './footer-pijaoscaciques.component';

describe('FooterPijaosCaciquesComponent', () => {
  let component: FooterPijaosCaciquesComponent;
  let fixture: ComponentFixture<FooterPijaosCaciquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterPijaosCaciquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterPijaosCaciquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
