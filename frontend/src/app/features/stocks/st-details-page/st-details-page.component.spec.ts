import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StDetailsPageComponent } from './st-details-page.component';

describe('StDetailsPageComponent', () => {
  let component: StDetailsPageComponent;
  let fixture: ComponentFixture<StDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
