import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterStockFormComponent } from './filter-stock-form.component';

describe('FilterStockFormComponent', () => {
  let component: FilterStockFormComponent;
  let fixture: ComponentFixture<FilterStockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterStockFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterStockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
