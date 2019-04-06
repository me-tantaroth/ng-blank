import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutCorpayandeComponent } from './layout-corpayande.component';

describe('LayoutCorpayandeComponent', () => {
  let component: LayoutCorpayandeComponent;
  let fixture: ComponentFixture<LayoutCorpayandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutCorpayandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutCorpayandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
