import { TestBed } from '@angular/core/testing';

import { ClipboardUtilsService } from './clipboard-utils-service';

describe('ClipboardUtilsService', () => {
  let service: ClipboardUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipboardUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
