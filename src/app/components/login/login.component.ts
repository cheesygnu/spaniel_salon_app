import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { myAuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(public auth: myAuthService) {}


  signup() {
    this.auth.signup(this.email, this.password);
    this.email = this.password = '';
  }

  loginWithEmail() {
    this.auth.login(this.email, this.password);
    this.email = this.password = '';
  }

  logout() {
    this.auth.logout();
  }

}
