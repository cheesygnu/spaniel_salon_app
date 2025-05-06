import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
    selector: 'app-my-main',
    imports: [RouterModule, NavigationComponent],
    templateUrl: 'my-main.component.html',
    styleUrl: 'my-main.component.css'
})
export class MyMainComponent {

}
