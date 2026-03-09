// ================= ANGULAR CORE =================
import { Component } from '@angular/core';

// Router tools
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

// RxJS operator to filter router events
import { filter } from 'rxjs/operators';

// Angular structural directive
import { NgIf } from '@angular/common';

// ================= CUSTOM COMPONENTS =================
import { Heading } from './heading/heading';
import { NavigationComponent } from './layout/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Heading,
    NavigationComponent,
    NgIf
  ],
  templateUrl: './app.html'
})
export class AppComponent {

  showLayout = false; // Start hidden by default

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        const currentUrl = event.urlAfterRedirects;

        const publicRoutes = [
          '/login',
          '/register',
          '/reset-password'
        ];

        // Hide layout if route is public
        //this.showLayout = !publicRoutes.includes(currentUrl);
        this.showLayout = !publicRoutes.some(route => currentUrl.startsWith(route));

      });
  }
}