import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UkModalComponent } from './uk-modal.component';

describe('UkModalComponent', () => {
  let component: UkModalComponent;
  let fixture: ComponentFixture<UkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
