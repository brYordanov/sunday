import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStockFormComponent } from './register-stock-form.component';

describe('RegisterStockFormComponent', () => {
  let component: RegisterStockFormComponent;
  let fixture: ComponentFixture<RegisterStockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStockFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterStockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
