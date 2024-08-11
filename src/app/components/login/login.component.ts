import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { myAuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import packageJson from '../../../../package.json';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  public version: string = packageJson.version;

  constructor(public auth: myAuthService) {}

  loginWithEmail() {
    this.auth.login(this.email, this.password);
    this.email = this.password = '';
    console.log("Is this before the error");
  }

}
