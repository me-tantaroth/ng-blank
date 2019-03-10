import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserListComponent } from './modal-user-list.component';

describe('ModalUserListComponent', () => {
  let component: ModalUserListComponent;
  let fixture: ComponentFixture<ModalUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
