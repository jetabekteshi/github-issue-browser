import { TestBed } from '@angular/core/testing';

import { SearchIssueService } from './search-issue.service';

describe('SearchIssueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchIssueService = TestBed.get(SearchIssueService);
    expect(service).toBeTruthy();
  });
});
