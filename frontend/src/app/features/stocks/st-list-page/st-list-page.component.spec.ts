import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksListComponent } from './st-list-page.component';

describe('StocksComponent', () => {
  let component: StocksListComponent;
  let fixture: ComponentFixture<StocksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StocksListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StocksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
