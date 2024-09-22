import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-my-main',
  standalone: true,
  imports: [RouterModule, NavigationComponent],
  templateUrl: 'my-main.component.html',
  styleUrl: 'my-main.component.css'
})
export class MyMainComponent {

}
