import { Component, OnInit} from '@angular/core';

import { Observable } from 'rxjs';
import { myAuthService } from '../../auth/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HomepageComponent } from "../homepage/homepage.component";
import packageJson from '../../../../package.json';

@Component({
    selector: 'app-navigation',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, HomepageComponent],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css'
})
export class NavigationComponent {

  public version: string = packageJson.version

  constructor(public auth: myAuthService) {}

  loggedInStatus = this.auth.isLoggedIn;
}
