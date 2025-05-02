import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from './shared/components/container/container.component';
import { HeaderComponent } from './layout/header/header.component';
import { MobileMenuComponent } from './layout/mobile-menu/mobile-menu.component';
import { MobileMenuService } from './layout/mobile-menu/mobile-menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ContainerComponent,
    HeaderComponent,
    HeaderComponent,
    MobileMenuComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  mobileMenuService = inject(MobileMenuService);
  isMobileMenuOpen$ = this.mobileMenuService.isOpen$;
}
