import { Component } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { RouterModule } from '@angular/router';
import { LightSwitchBtnComponent } from '../../shared/components/light-switch-btn/light-switch-btn.component';

@Component({
  selector: 'app-header',
  imports: [ContainerComponent, RouterModule, LightSwitchBtnComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
