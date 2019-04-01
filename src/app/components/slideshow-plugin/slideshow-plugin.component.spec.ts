import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideshowPluginComponent } from './slideshow-plugin.component';

describe('SlideshowPluginComponent', () => {
  let component: SlideshowPluginComponent;
  let fixture: ComponentFixture<SlideshowPluginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideshowPluginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideshowPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
