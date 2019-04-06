import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadLayoutComponent } from './load-layout.component';

describe('LoadLayoutComponent', () => {
  let component: LoadLayoutComponent;
  let fixture: ComponentFixture<LoadLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
