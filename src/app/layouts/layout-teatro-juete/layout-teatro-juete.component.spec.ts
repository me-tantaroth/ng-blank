import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutTeatroJueteComponent } from './layout-teatro-juete.component';

describe('LayoutCorpayandeComponent', () => {
  let component: LayoutTeatroJueteComponent;
  let fixture: ComponentFixture<LayoutTeatroJueteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutTeatroJueteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutTeatroJueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
