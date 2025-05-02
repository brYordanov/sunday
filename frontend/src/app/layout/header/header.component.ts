import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { LightSwitchBtnComponent } from '../../shared/components/light-switch-btn/light-switch-btn.component';
import { isPlatformBrowser } from '@angular/common';
import { hexToRgba } from '../../shared/components/helpers';
import { MobileMenuService } from '../mobile-menu/mobile-menu.service';

@Component({
  selector: 'app-header',
  imports: [ContainerComponent, RouterModule, LightSwitchBtnComponent, MatIcon, MatRippleModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  mobileMenuService = inject(MobileMenuService);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  rippleColor: string = '';

  ngOnInit() {
    if (!this.isBrowser) return;
    const color = getComputedStyle(document.body).getPropertyValue('--color-accent-primary').trim();
    this.rippleColor = hexToRgba(color, 0.5);
  }

  openMobileMenu() {
    this.mobileMenuService.open();
  }
}
