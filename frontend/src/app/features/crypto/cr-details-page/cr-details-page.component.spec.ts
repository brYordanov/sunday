import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrDetailsPageComponent } from './cr-details-page.component';

describe('CrDetailsPageComponent', () => {
  let component: CrDetailsPageComponent;
  let fixture: ComponentFixture<CrDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
