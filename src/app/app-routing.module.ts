import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IssuesListComponent} from './issues-list/issues-list.component';
import {IssueDetailsComponent} from './issues-list/issue-details/issue-details.component';

const routes: Routes = [
  {
    path: '',
    component: IssuesListComponent,

  },
  {
    path: ':issueNumber',
    component: IssueDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
