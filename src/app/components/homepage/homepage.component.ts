import { Component } from '@angular/core';
import { myAuthService } from '../../auth/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavigationComponent, RouterOutlet],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  constructor(public auth: myAuthService) {}

  loggedInStatus = this.auth.isLoggedIn;

}
