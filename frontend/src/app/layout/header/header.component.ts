import { Component, inject } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme-service';

@Component({
  selector: 'app-header',
  imports: [ContainerComponent, MatIconModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
