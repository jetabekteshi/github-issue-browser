import {Component, OnInit} from '@angular/core';
import {SearchIssueService} from '../search-issue.service';
import {IssueModel, PageInfo, StateType} from '../models';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  issues: IssueModel[];
  numberOfTotalIssues: number;
  pageInfo: PageInfo;

  issueState: StateType;

  startCursor: string;
  initialStartCursor: string; // the start cursor of the first page
  endCursor: string;
  searchTerm: string;
  loadingIndicator: boolean;

  constructor(private searchIssueService: SearchIssueService) {
  }

  ngOnInit() {
    this.issueState = 'OPEN';
    this.getIssues(true);
  }

  getIssues(shouldStoreFirstCursor = false) {
    this.loadingIndicator = true;
    this.searchIssueService.getIssues(this.issueState,
      this.startCursor, this.endCursor, this.searchTerm).subscribe(response => {
      this.issues = response.edges;
      this.numberOfTotalIssues = response.totalCount ? response.totalCount : response.issueCount;
      this.pageInfo = response.pageInfo;
      if (shouldStoreFirstCursor) {
        this.initialStartCursor = this.pageInfo.startCursor;
      }
      this.loadingIndicator = false;
    }, () => this.loadingIndicator = false);
  }

  onPreviousPage() {
    this.startCursor = this.pageInfo.startCursor;
    this.endCursor = null;
    this.getIssues();
  }

  onNextPage() {
    this.endCursor = this.pageInfo.endCursor;
    this.startCursor = null;
    this.getIssues();
  }

  onSearchValueChanges(searchValue: string) {
    this.searchTerm = searchValue;
    this.getIssues(true);
  }

  onIssueStateChange($event: StateType) {
    this.issueState = $event;
    this.startCursor = null;
    this.endCursor = null;
    this.getIssues(true);
  }
}
