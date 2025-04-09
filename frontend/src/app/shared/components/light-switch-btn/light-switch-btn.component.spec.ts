import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightSwitchBtnComponent } from './light-switch-btn.component';

describe('LightSwitchBtnComponent', () => {
  let component: LightSwitchBtnComponent;
  let fixture: ComponentFixture<LightSwitchBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightSwitchBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightSwitchBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
