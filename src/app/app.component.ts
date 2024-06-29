import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UploadListComponent } from './components/upload-list/upload-list.component';
import { HomepageComponent } from './components/homepage/homepage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UploadListComponent, RouterLink, RouterLinkActive, HomepageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'beercss_html';
  myappname = "Spaniel Salon App";
  /*salonLogo: string;

  constructor(){
    this.salonLogo = '../assets/images/icon-512x512.png'
  }*/
}
