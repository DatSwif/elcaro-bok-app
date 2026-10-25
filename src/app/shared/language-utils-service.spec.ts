import { TestBed } from '@angular/core/testing';

import { LanguageUtilsService } from './language-utils-service';

describe('LanguageUtilsService', () => {
  let service: LanguageUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
