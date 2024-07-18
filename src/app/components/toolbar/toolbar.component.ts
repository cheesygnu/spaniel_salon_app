import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {/*implements OnInit{

  visible: boolean;
  viewedPage: any;
  //event: any;


  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.visible = false; // set toolbar visible to false
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
      )
      .pipe(
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data),
      )
      .subscribe(event => {
        this.viewedPage = event.title; // title of page
        this.showToolbar(event.toolbar); // show the toolbar?
      });
  }

  showToolbar(event) {
    if (event === false) {
      this.visible = false;
    } else if (event === true) {
      this.visible = true;
    } else {
      this.visible = this.visible;
    }
  }

*/
}
