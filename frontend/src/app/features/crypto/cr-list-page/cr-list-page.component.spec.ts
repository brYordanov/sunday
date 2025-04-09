import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrListPageComponent } from './cr-list-page.component';

describe('CrListPageComponent', () => {
  let component: CrListPageComponent;
  let fixture: ComponentFixture<CrListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
