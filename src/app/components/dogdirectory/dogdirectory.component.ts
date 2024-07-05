import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from '../../models/dog.model';
import { UploadListComponent } from '../upload-list/upload-list.component';
import { DogCreatorService } from '../../services/dogcreator.service';
import { RouterLink, RouterOutlet } from '@angular/router';
//import {dog2} from '../services/dogcreator.service';

@Component({
  selector: 'app-dogdirectory',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterLink],
  templateUrl: './dogdirectory.component.html',
  styleUrl: './dogdirectory.component.css'
})
export class DogDirectoryComponent {
  // Get list of all the dogs

  //dogname!: string;
  //owner!: string;


  allDogsInComponent: Dog[] = []; //[{dogname: "gg", owner: "dd"},{dogname: "jk", owner: "ow"} ];


  constructor(private dogcreator: DogCreatorService){;
  }

  ngOnInit(): void {
    console.log("calling dogcreator1");
    this.dogcreator.getDogs()
      .then(allDogs => this.allDogsInComponent = allDogs);
  }
}
