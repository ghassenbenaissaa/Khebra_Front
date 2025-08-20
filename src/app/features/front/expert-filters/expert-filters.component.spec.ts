import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertFiltersComponent } from './expert-filters.component';

describe('ExpertFiltersComponent', () => {
  let component: ExpertFiltersComponent;
  let fixture: ComponentFixture<ExpertFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
