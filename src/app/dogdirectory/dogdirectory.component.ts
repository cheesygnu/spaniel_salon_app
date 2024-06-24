import { Component } from '@angular/core';
import { Dog } from '../models/dog.model';
import { FileUploadService } from '../services/file-upload.service';
import { FileUpload } from '../models/file-upload.model';
import { UploadListComponent } from '../components/upload-list/upload-list.component';
//import {dog2} from '../services/dogcreator.service';

@Component({
  selector: 'app-dogdirectory',
  standalone: true,
  imports: [UploadListComponent],
  templateUrl: './dogdirectory.component.html',
  styleUrl: './dogdirectory.component.css'
})
export class DogDirectoryComponent {
  dog2 = new Dog("Fido", "Walter the Softy");
  dog2name = this.dog2.dogname;
  dog2owner = this.dog2.owner

  dog3 = new Dog("Gnasher", "Dennis the Menace");
  dog3name = this.dog3.dogname;
  dog3owner = this.dog3.owner

}
