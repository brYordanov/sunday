import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCryptoFormComponent } from './filter-crypto-form.component';

describe('FilterCryptoFormComponent', () => {
  let component: FilterCryptoFormComponent;
  let fixture: ComponentFixture<FilterCryptoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterCryptoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterCryptoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
