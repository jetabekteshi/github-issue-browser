import {Component, Input, OnInit} from '@angular/core';
import {IssueModel} from '../../models';

@Component({
  selector: 'app-single-issue',
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
