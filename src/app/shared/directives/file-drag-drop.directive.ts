import {
  Directive,
  HostListener,
  HostBinding,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

@Directive({
  selector: '[appFileDragDrop]'
})
export class FileDragDropDirective {
  @Input() private defaultColor: string;
  @Input() private dragColor: string;
  @Input() private allowed_extensions: Array<string> = [];
  @Output() private filesChangeEmiter: EventEmitter<
    File[]
  > = new EventEmitter();
  @Output() private filesInvalidEmiter: EventEmitter<
    File[]
  > = new EventEmitter();
  @HostBinding('style.color') private color;
  @HostBinding('style.borderColor') private borderColor;
  @HostBinding('style.background') private background;

  constructor() {}

  @HostListener('click', ['$event']) public onClick(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();

    const file = document.createElement('input');

    file.type = 'file';
    file.style.display = 'none';
    file.addEventListener('change', (evtChanged: any) => {
      this.previewImage(evtChanged.target.files);
    });
    file.click();

    document.body.appendChild(file);
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderColor = this.dragColor;
    this.background = '#fafafa';
    this.color = '#5f5f5';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderColor = this.defaultColor;
    this.background = '#eee';
    this.color = '#222';
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderColor = this.defaultColor;
    this.background = '#eee';
    this.color = '#5f5f5';
    this.previewImage(evt.dataTransfer.files);
  }

  previewImage(files) {
    const reader = new FileReader();
    const valid_files: Array<File> = [];
    const invalid_files: Array<File> = [];

    reader.onload = (event: any) => {
      this.background = `url(${event.target.result})`;
    };

    if (files.length > 0) {
      for (const file of files) {
        const ext = file.name.split('.')[file.name.split('.').length - 1];

        reader.readAsDataURL(file);

        if (this.allowed_extensions.lastIndexOf(ext) !== -1) {
          valid_files.push(file);
        } else {
          invalid_files.push(file);
        }
      }
      this.filesChangeEmiter.emit(valid_files);
      this.filesInvalidEmiter.emit(invalid_files);
    }
  }
}
