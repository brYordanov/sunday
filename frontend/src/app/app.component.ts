import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from './shared/components/container/container.component';
import { HeaderComponent } from './layout/header/header.component';
import { MobileMenuComponent } from './layout/mobile-menu/mobile-menu.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ContainerComponent,
    HeaderComponent,
    HeaderComponent,
    MobileMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
