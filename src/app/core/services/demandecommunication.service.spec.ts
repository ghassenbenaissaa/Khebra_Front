import { TestBed } from '@angular/core/testing';

import { DemandecommunicationService } from './demandecommunication.service';

describe('DemandecommunicationService', () => {
  let service: DemandecommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandecommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
