import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSaveComponent } from './page-save.component';

describe('PageSaveComponent', () => {
  let component: PageSaveComponent;
  let fixture: ComponentFixture<PageSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
