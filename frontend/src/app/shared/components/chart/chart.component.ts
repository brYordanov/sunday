import { AfterViewInit, Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChartData } from './chart.types';
import { isPlatformBrowser } from '@angular/common';
import type * as PlotlyJS from 'plotly.js';
import { ThemeService } from '../../../core/services/theme-service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-chart',
  imports: [MatButtonToggleModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements AfterViewInit {
  @Input() chartData: ChartData | null = null;
  @Input() id: string = '';
  platformId = inject(PLATFORM_ID);
  themeService = inject(ThemeService);

  chartType: 'candlestick' | 'line' | 'area' = 'candlestick';

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.themeService.theme$.pipe(tap(() => this.renderChart())).subscribe();
    this.renderChart();
  }

  onChartTypeChange(type: 'candlestick' | 'line' | 'area'): void {
    this.chartType = type;
    this.renderChart();
  }

  private async renderChart(): Promise<void> {
    const Plotly = await import('plotly.js-dist');

    if (!this.chartData) {
      console.error('Chart data is not provided');
      return;
    }

    const styles = getComputedStyle(document.body);
    const bgColor = styles.getPropertyValue('--color-background')?.trim();
    const textColor = styles.getPropertyValue('--color-text')?.trim();
    const lineColor = styles.getPropertyValue('--color-accent-primary')?.trim();
    const upColor = styles.getPropertyValue('--color-success')?.trim();
    const downColor = styles.getPropertyValue('--color-error')?.trim();
    const fontFamily = styles.getPropertyValue('--font-primary')?.trim();

    const layout: Partial<PlotlyJS.Layout> = {
      title: {
        text: 'Stock Price Chart',
        font: {
          family: fontFamily,
          color: textColor,
        },
      },
      paper_bgcolor: bgColor,
      plot_bgcolor: bgColor,
      font: {
        family: fontFamily,
        color: textColor,
      },
      xaxis: {
        type: 'date',
        color: textColor,
        gridcolor: 'rgba(255,255,255,0.05)',
        range: [this.chartData.dates[0], this.chartData.dates[this.chartData.dates.length - 1]],
      },
      yaxis: {
        title: {
          text: 'Price (USD)',
          font: { color: textColor },
        },
        tickfont: { color: textColor },
        gridcolor: 'rgba(255,255,255,0.05)',
        range: [Math.min(...this.chartData.close), Math.max(...this.chartData.close)],
      },
      margin: { t: 40, l: 50, r: 10, b: 40 },
    };

    let trace: any;

    if (this.chartType === 'candlestick') {
      trace = {
        x: this.chartData.dates,
        open: this.chartData.open,
        high: this.chartData.high,
        low: this.chartData.low,
        close: this.chartData.close,
        type: 'candlestick',
        name: 'Price',
        increasing: { line: { color: upColor } },
        decreasing: { line: { color: downColor } },
      };
      Plotly.react(`stock-chart-${this.id}`, [trace], layout, { responsive: true });
    } else {
      const totalFrames = this.chartData.dates.length;

      const x = this.chartData.dates;
      const y = this.chartData.close;
      trace = {
        x: this.chartData.dates,
        y: this.chartData.close,
        type: 'scatter',
        mode: 'lines',
        fill: this.chartType === 'area' ? 'tozeroy' : 'none',
        line: {
          color: lineColor,
          shape: 'linear',
        },
        name: 'Close Price',
      };

      if (totalFrames > 12) {
        Plotly.react(`stock-chart-${this.id}`, [trace], layout);
        return;
      }

      this.renderWithAnimation(trace, layout, x, y);
    }
  }

  private async renderWithAnimation(
    trace: any,
    layout: Partial<PlotlyJS.Layout>,
    x: string[],
    y: number[],
  ) {
    const Plotly = await import('plotly.js-dist');

    const initialTrace = {
      ...trace,
      x: [],
      y: [],
    };

    Plotly.react(`stock-chart-${this.id}`, [initialTrace], layout).then(() => {
      const frames = x.map((_, i) => ({
        data: [
          {
            x: x.slice(0, i + 1),
            y: y.slice(0, i + 1),
          },
        ],
      }));

      Plotly.animate(`stock-chart-${this.id}`, frames, {
        frame: { duration: 5, redraw: true },
        transition: { duration: 0 },
        mode: 'immediate',
      });
    });
  }
}
