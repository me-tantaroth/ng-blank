import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutUnconnnectedComponent } from './layout-unconnected.component';

describe('LayoutUnconnnectedComponent', () => {
  let component: LayoutUnconnnectedComponent;
  let fixture: ComponentFixture<LayoutUnconnnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutUnconnnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutUnconnnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
