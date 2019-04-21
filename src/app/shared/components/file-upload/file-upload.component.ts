import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() allowed_extensions: string;
  @Input() imageURL: string;
  @Output() private filesChanged: EventEmitter<File[]> = new EventEmitter();
  @Output() private filesInvalid: EventEmitter<File[]> = new EventEmitter();

  backgroundImageURL: string;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewChecked() {
    if (this.imageURL) {
      this.imageURL = this.imageURL;
      this.cdRef.detectChanges();
    }
  }

  ngOnInit() {
    this.backgroundImageURL = environment.backgroundImage;
  }

  onFilesChange(fileList: Array<File>) {
    this.filesChanged.emit(fileList);
  }

  onFileInvalids(fileList: Array<File>) {
    this.filesInvalid.emit(fileList);
  }
}
