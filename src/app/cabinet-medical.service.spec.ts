import { TestBed, inject } from '@angular/core/testing';

import { CabinetMedicalService } from './cabinet-medical.service';

describe('CabinetMedicalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CabinetMedicalService]
    });
  });

  it('should be created', inject([CabinetMedicalService], (service: CabinetMedicalService) => {
    expect(service).toBeTruthy();
  }));
});
