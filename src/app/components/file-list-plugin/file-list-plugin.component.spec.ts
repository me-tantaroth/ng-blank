import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListPluginComponent } from './file-list-plugin.component';

describe('FileListPluginComponent', () => {
  let component: FileListPluginComponent;
  let fixture: ComponentFixture<FileListPluginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileListPluginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
