import { Component, OnInit} from '@angular/core';


import { Observable } from 'rxjs';
import { myAuthService } from '../../auth/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import packageJson from '../../../../package.json';
import { StatusBarService } from '../../services/statusBar.service';

@Component({
    selector: 'app-navigation',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css'
})
export class NavigationComponent {

  public version: string = packageJson.version

  constructor(public auth: myAuthService, private myStatusBar: StatusBarService) {}

  loggedInStatus = this.auth.isLoggedIn;
  showStatusBar: string = '';
  showStatusBarBool: boolean = true;

  ngOnInit(): void {
    // Subscribe the current visibility property of Status Bar service to get real time value
    this.myStatusBar.currentVisibility.subscribe(
      // update the component's property
      visibility => {
        this.showStatusBar = visibility;
        this.showStatusBarBool = this.showStatusBar === 'show';
      }
    );

  }
}
