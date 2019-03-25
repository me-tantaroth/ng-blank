import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPageListComponent } from './modal-page-list.component';

describe('ModalPageListComponent', () => {
  let component: ModalPageListComponent;
  let fixture: ComponentFixture<ModalPageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
