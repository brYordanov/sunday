import { Component, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { hexToRgba } from '../../shared/components/helpers';
import { MobileMenuService } from './mobile-menu.service';

@Component({
  selector: 'app-mobile-menu',
  imports: [MatIcon, MatSidenavModule, RouterModule, MatRippleModule, CommonModule],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent implements OnInit {
  mobileMenuService = inject(MobileMenuService);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  isActive$ = this.mobileMenuService.isOpen$;
  rippleColor: string = '';

  ngOnInit() {
    if (!this.isBrowser) return;
    const color = getComputedStyle(document.body).getPropertyValue('--color-accent-primary').trim();
    this.rippleColor = hexToRgba(color, 0.5);
  }

  closeMenu() {
    this.mobileMenuService.close();
  }
}
