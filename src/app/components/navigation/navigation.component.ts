import { Component, computed } from '@angular/core';
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
  showStatusBarBool = computed(() => this.myStatusBar.visibility() === 'show');
}
