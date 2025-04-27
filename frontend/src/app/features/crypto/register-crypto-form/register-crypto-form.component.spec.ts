import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCryptoFormComponent } from './register-crypto-form.component';

describe('RegisterCryptoFormComponent', () => {
  let component: RegisterCryptoFormComponent;
  let fixture: ComponentFixture<RegisterCryptoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCryptoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCryptoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
