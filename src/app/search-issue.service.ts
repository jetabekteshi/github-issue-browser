import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {IssuesResponse, StateType} from './models';

@Injectable({
  providedIn: 'root'
})

export class SearchIssueService {

  constructor(private apollo: Apollo) {
  }

  getIssues(state: StateType = 'OPEN', startCursor: string, endCursor: string): Observable<IssuesResponse> {
    let paginationParam = '';
    if (startCursor) {
      paginationParam = `before: "${startCursor}"`;
    }
    if (endCursor) {
      paginationParam = `after: "${endCursor}"`;
    }
    return this.apollo
      .query({
        query: gql`
{
repository(owner:"angular", name:"angular") {
    issues(last:20, states:${state} ${paginationParam}) {
       edges {
            node {
              title
              url
              number
              updatedAt
              author {
                login
              }
              comments{
                totalCount
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            startCursor
               hasNextPage
          }
        }
      }
    } `,
      });
  }

  getIssue(issueNumber: string): Observable<IssuesResponse> {
    return this.apollo
      .query({
        query: gql`
{
 repository(owner: "angular", name: "angular") {
        issue(number: ${issueNumber}) {
          bodyHTML
          title
          number
          updatedAt
          author{
            login
          }
          comments(last: 25) {
            totalCount
            edges {
              node {
                bodyHTML
                author{
                  login
                },
              }
            }
          }
        }
      }
    }`
      });
  }
}
