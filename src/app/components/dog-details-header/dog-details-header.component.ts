import { Component,Input } from '@angular/core';
import { Location } from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dog-details-header',
  imports: [FormsModule],
  templateUrl: './dog-details-header.component.html',
  styleUrl: './dog-details-header.component.css'
})
export class DogDetailsHeaderComponent {

  @Input() titleText!: string;
  public editStatus: Boolean =false;
  public disabledStatus: boolean = !this.editStatus;

  constructor(
    //private route: ActivatedRoute,
    //private dogCreatorservice: DogCreatorService,
    private location: Location,
    ) {}

  backClicked() {
    console.log('Clicked Back');
    /*this.displayedDog = structuredClone(BLANK_DOG);
    console.log("BLANK_DOG looks like this ", BLANK_DOG);
    console.log("Blanking displayedDog", this.displayedDog);*/
    this.location.back();
  }

  editClicked(){
    console.log('Clicked Edit');
    console.log('Editing details for dogname', this.titleText);
    this.editStatus= !this.editStatus;
    this.disabledStatus = !this.disabledStatus;
  }

  async saveClicked(){
      this.editStatus= !this.editStatus;
      this.disabledStatus = !this.disabledStatus;
  }

}
