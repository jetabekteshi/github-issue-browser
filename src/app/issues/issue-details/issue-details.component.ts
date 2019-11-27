import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SearchIssueService} from '../search-issue.service';
import {IssueDetails} from '../issue.models';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.scss']
})
export class IssueDetailsComponent implements OnInit {
  issueNumber: string;
  issueDetails: IssueDetails;

  constructor(private activatedRoute: ActivatedRoute,
              private searchIssueService: SearchIssueService) {
  }

  ngOnInit() {
    this.setIssueNumberFromRoute();
    this.getIssue();
  }

  setIssueNumberFromRoute() {
    this.issueNumber = this.activatedRoute.snapshot.params.issueNumber;
  }

  getIssue() {
    this.searchIssueService.getIssue(this.issueNumber).subscribe(response => {
      this.issueDetails = response;
    });
  }

}
