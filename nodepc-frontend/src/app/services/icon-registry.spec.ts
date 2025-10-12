import { TestBed } from '@angular/core/testing';

import { IconRegistry } from './icon-registry';

describe('IconRegistry', () => {
  let service: IconRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconRegistry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
