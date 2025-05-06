import { Component } from '@angular/core';
import { myAuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-homepage',
    imports: [],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  constructor(public auth: myAuthService) {}

  loggedInStatus = this.auth.isLoggedIn;

}
