import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() allowed_extensions: string[];
  @Input() imageURL: string;
  @Output() private filesChanged: EventEmitter<File[]> = new EventEmitter();
  @Output() private filesInvalid: EventEmitter<File[]> = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  onFilesChange(fileList: Array<File>) {
    this.filesChanged.emit(fileList);
  }

  onFileInvalids(fileList: Array<File>) {
    this.filesInvalid.emit(fileList);
  }
}
