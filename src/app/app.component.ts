import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DogDirectoryComponent } from './dogdirectory/dogdirectory.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DogDirectoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'beercss_html';
  myappname = "Spaniel Salon App";
}
