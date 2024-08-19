import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { myAuthService } from '../../auth/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HomepageComponent } from "../homepage/homepage.component";
import packageJson from '../../../../package.json';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HomepageComponent, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

  public version: string = packageJson.version

  constructor(public auth: myAuthService) {}

  loggedInStatus = this.auth.isLoggedIn;
}
