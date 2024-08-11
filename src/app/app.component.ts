import { Component } from '@angular/core';
import { Router,RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UploadListComponent } from './components/upload-list/upload-list.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { myAuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UploadListComponent, RouterLink, RouterLinkActive, HomepageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'beercsshtml';
  myappname = "Spaniel Salon App";

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
