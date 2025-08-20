import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCommunicationComponent } from './demande-communication.component';

describe('DemandeCommunicationComponent', () => {
  let component: DemandeCommunicationComponent;
  let fixture: ComponentFixture<DemandeCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeCommunicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
