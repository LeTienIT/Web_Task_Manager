import { TestBed } from '@angular/core/testing';

import { DeleteAttService } from './delete-att.service';

describe('DeleteAttService', () => {
  let service: DeleteAttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteAttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
