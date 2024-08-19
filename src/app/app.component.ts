import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink, RouterOutlet } from '@angular/router';
import { myAuthService } from './auth/auth.service';
import { NavigationComponent } from "./components/navigation/navigation.component";
import packageJson from '../../package.json';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'beercsshtml';
  myappname = "Spaniel Salon App";
  public version: string = packageJson.version;

  constructor(public auth: myAuthService, private router: Router) {}

  loginStatus= this.auth.isLoggedIn;

  ngOnInit(): void {
    console.log("B. Login Staus is ",this.loginStatus);
    if (!this.loginStatus){
      this.router.navigate(['login'])
    }
    else {
      this.router.navigate(['homepage'])
    }

  }

}
