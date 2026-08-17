import { Component } from '@angular/core';
import { myAuthService } from '../../auth/auth.service';
import { ImportFromFile } from "../import-from-file/import-from-file";

@Component({
    selector: 'app-homepage',
    imports: [ImportFromFile],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  constructor(public auth: myAuthService) {}

  loggedInStatus = this.auth.isLoggedIn;

}
