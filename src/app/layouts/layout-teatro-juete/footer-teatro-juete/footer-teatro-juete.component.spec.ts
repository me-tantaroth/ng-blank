import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterTeatroJueteComponent } from './footer-teatro-juete.component';

describe('FooterTeatroJueteComponent', () => {
  let component: FooterTeatroJueteComponent;
  let fixture: ComponentFixture<FooterTeatroJueteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterTeatroJueteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterTeatroJueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
