import {Component, Input, OnInit} from '@angular/core';
import {IssueModel} from '../issue.models';

@Component({
  selector: 'app-issue-item',
  templateUrl: './issue-item.component.html',
  styleUrls: ['./issue-item.component.scss']
})
export class IssueItemComponent implements OnInit {
  @Input() issue: IssueModel;

  constructor() {
  }

  ngOnInit() {
  }
}
