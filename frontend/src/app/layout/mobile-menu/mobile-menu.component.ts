import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-mobile-menu',
  imports: [MatIcon, MatSidenavModule, RouterModule, MatRippleModule],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent {
  rippleColor: string = 'red';
}
