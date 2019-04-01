import {
  Directive,
  OnInit,
  HostListener,
  HostBinding,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

@Directive({
  selector: '[appFileDragDrop]'
})
export class FileDragDropDirective implements OnInit {
  @Input() private defaultColor: string;
  @Input() private dragColor: string;
  @Input() private imageURL: string;
  @Input() private allowed_extensions: Array<string> = [];
  @Output() private filesChangeEmiter: EventEmitter<
    File[]
  > = new EventEmitter();
  @Output() private filesInvalidEmiter: EventEmitter<
    File[]
  > = new EventEmitter();
  @HostBinding('style.color') private color;
  @HostBinding('style.borderColor') private borderColor;
  @HostBinding('style.backgroundColor') private backgroundColor;
  @HostBinding('style.backgroundImage') private backgroundImage;

  constructor() {}

  ngOnInit() {
    console.log('## FILE DIRECIVE', this.imageURL);
    if (this.imageURL) {
      this.backgroundImage = `url(${this.imageURL})`;
    }
  }

  @HostListener('click', ['$event']) public onClick(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();

    const file: any = document.createElement('input');

    file.type = 'file';
    file.accept = this.allowed_extensions;
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
    this.backgroundColor = '#fafafa';
    this.color = '#5f5f5';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderColor = this.defaultColor;
    this.backgroundColor = '#eee';
    this.color = '#222';
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.borderColor = this.defaultColor;
    this.backgroundColor = '#eee';
    this.color = '#5f5f5';
    this.previewImage(evt.dataTransfer.files);
  }

  previewImage(files) {
    const reader = new FileReader();
    const valid_files: Array<File> = [];
    const invalid_files: Array<File> = [];

    reader.onload = (event: any) => {
      this.backgroundImage = `url(${event.target.result})`;
    };

    if (files.length > 0) {
      for (const file of files) {
        const ext = file.name.split('.')[file.name.split('.').length - 1];

        if (file.type.search('image/') >= 0) {
          reader.readAsDataURL(file);
        }

        valid_files.push(file);
      }
      this.filesChangeEmiter.emit(valid_files);
      this.filesInvalidEmiter.emit(invalid_files);
    }
  }
}
