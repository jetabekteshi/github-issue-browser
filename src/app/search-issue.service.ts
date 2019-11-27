import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {IssuesResponse, Query, SearchQuery, StateType} from './models';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SearchIssueService {

  elementsToReturn: ELEMENTS_TO_RETURN;

  constructor(private apollo: Apollo) {
  }

  getIssues(state: StateType = 'OPEN', startCursor: string,
            endCursor: string, searchTerm: string): Observable<IssuesResponse> {
    const queryResults = searchTerm ? this.searchIssues(startCursor, endCursor, searchTerm)
      : this.queryIssues(state, startCursor, endCursor);
    return queryResults.pipe(map(result => {
      result.edges = result.edges.filter(item => item.node.number);
      return result;
    }));
  }

  queryIssues(state: StateType = 'OPEN', startCursor: string, endCursor: string): Observable<IssuesResponse> {
    let paginationParam = '';
    let elementsToReturn = 'first';
    if (startCursor) {
      paginationParam = `before: "${startCursor}"`;
      elementsToReturn = 'last';
    }
    if (endCursor) {
      paginationParam = `after: "${endCursor}"`;
    }
    return this.apollo
      .query({
        query: gql`
{
repository(owner:"angular", name:"angular") {
    issues(${elementsToReturn}:20, states:${state} ${paginationParam}, orderBy: {field: CREATED_AT, direction: DESC}) {
       edges {
            node {
              title
              url
              number
              createdAt
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
      }).pipe(map(result => (result.data as Query).repository.issues));
  }

  searchIssues(startCursor: string, endCursor: string, searchTerm: string): Observable<IssuesResponse> {
    let paginationParam = '';
    let elementsToReturn = 'first';
    if (startCursor) {
      paginationParam = `before: "${startCursor}"`;
      elementsToReturn = 'last';
    }
    if (endCursor) {
      paginationParam = `after: "${endCursor}"`;
    }
    return this.apollo
      .query({
        query: gql`
{
    search(query: "repo:angular/angular ${searchTerm}",
    type: ISSUE, ${elementsToReturn}:20, ${paginationParam}) {
       edges {
            node {   ... on Issue {
              title
              url
              number
              createdAt
              author {
                login
              }
              comments{
                totalCount
              }
            }
          }
        }
         pageInfo {
            endCursor
            startCursor
               hasNextPage
          }
          issueCount
      }}
    `,
      }).pipe(map(result => (result.data as SearchQuery).search));
  }

  getIssue(issueNumber: string): Observable<any> {
    return this.apollo
      .query({
        query: gql`
{
 repository(owner: "angular", name: "angular") {
        issue(number: ${issueNumber}) {
          bodyHTML
          title
          number
          createdAt
          author{
            login
          }
          comments(last: 20) {
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

type ELEMENTS_TO_RETURN = 'first' | 'last';
