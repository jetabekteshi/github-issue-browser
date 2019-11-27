import {Component, OnInit} from '@angular/core';
import {SearchIssueService} from '../search-issue.service';
import {IssueModel, PageInfo, StateType} from '../models';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  dataSource: IssueModel[];
  numberOfTotalIssues: number;
  pageInfo: PageInfo;
  issueState: StateType;
  startCursor: string;
  endCursor: string;
  searchTerm: string;

  constructor(private searchIssueService: SearchIssueService) {
  }

  ngOnInit() {
    this.issueState = 'OPEN';
    this.getIssues();
  }

  getIssues() {
    this.searchIssueService.getIssues(this.issueState,
      this.startCursor, this.endCursor, this.searchTerm).subscribe(response => {
      this.dataSource = response.edges;
      this.numberOfTotalIssues = response.totalCount ? response.totalCount : response.issueCount;
      this.pageInfo = response.pageInfo;
    });
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
    this.getIssues();
  }

  onIssueStateChange($event: StateType) {
    this.issueState = $event;
    this.getIssues();
  }
}
