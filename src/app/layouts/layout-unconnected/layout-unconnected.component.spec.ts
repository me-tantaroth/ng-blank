import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutUnconnectedComponent } from './layout-unconnected.component';

describe('LayoutUnconnectedComponent', () => {
  let component: LayoutUnconnectedComponent;
  let fixture: ComponentFixture<LayoutUnconnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutUnconnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutUnconnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
