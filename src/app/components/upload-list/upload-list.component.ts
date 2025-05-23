import { Component, OnInit } from '@angular/core';

import { FileUploadService } from '../../services/file-upload.service';
import { UploadDetailsComponent } from '../upload-details.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-upload-list',
    imports: [UploadDetailsComponent],
    templateUrl: './upload-list.component.html',
    styleUrls: ['./upload-list.component.css'],
    providers: [FileUploadService]
})
export class UploadListComponent implements OnInit {
  fileUploads?: any[];

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.uploadService.getFiles(6).snapshotChanges().pipe(
      map(changes =>
        // store the key
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
    });
  }
}
