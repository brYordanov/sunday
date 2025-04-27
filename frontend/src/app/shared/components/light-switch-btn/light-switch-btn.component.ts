import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-light-switch-btn',
  imports: [MatIconModule],
  templateUrl: './light-switch-btn.component.html',
  styleUrl: './light-switch-btn.component.scss',
})
export class LightSwitchBtnComponent {
  private readonly themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
