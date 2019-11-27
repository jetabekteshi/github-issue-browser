import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {
  IssueDetails, IssuesResponse, QueryDetailsResponse,
  QueryListResponse, SearchQuery, StateType
} from './models';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SearchIssueService {

  elementsToReturn: ELEMENTS_TO_RETURN;
  paginationArguments: string;

  constructor(private apollo: Apollo) {
  }

  getIssues(state: StateType = 'OPEN', startCursor: string,
            endCursor: string, searchTerm: string): Observable<IssuesResponse> {
    const queryResults = searchTerm ? this.searchIssues(state, startCursor, endCursor, searchTerm)
      : this.queryIssues(state, startCursor, endCursor);
    return queryResults.pipe(map(result => {
      result.edges = result.edges.filter(item => item.node.number);
      return result;
    }));
  }

  queryIssues(state: StateType, startCursor: string, endCursor: string): Observable<IssuesResponse> {
    this.setQueryArguments(startCursor, endCursor);
    return this.apollo
      .query({
        query: gql`
{
repository(owner:"angular", name:"angular") {
    issues(${this.elementsToReturn}:20, states:${state} ${this.paginationArguments}, orderBy: {field: CREATED_AT, direction: DESC}) {
       edges {
            node {
              title
              url
              number
              closed
              closedAt
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
      }).pipe(map(result => (result.data as QueryListResponse).repository.issues));
  }

  searchIssues(state: StateType, startCursor: string, endCursor: string, searchTerm: string): Observable<IssuesResponse> {
    this.setQueryArguments(startCursor, endCursor);
    const queryState = (state === 'OPEN') ? 'is:open' : 'is:closed';
    return this.apollo
      .query({
        query: gql`
{
    search(query: "repo:angular/angular ${searchTerm} ${queryState} is:issue",
    type: ISSUE, ${this.elementsToReturn}:20, ${this.paginationArguments}) {
       edges {
            node {   ... on Issue {
              title
              url
              number
              closed
              closedAt
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

  setQueryArguments(startCursor: string, endCursor: string) {
    this.paginationArguments = '';
    this.elementsToReturn = 'first';
    if (startCursor) {
      this.paginationArguments = `before: "${startCursor}"`;
      this.elementsToReturn = 'last';
    }
    if (endCursor) {
      this.paginationArguments = `after: "${endCursor}"`;
    }
  }

  getIssue(issueNumber: string): Observable<IssueDetails> {
    return this.apollo
      .query({
        query: gql`
{
 repository(owner: "angular", name: "angular") {
        issue(number: ${issueNumber}) {
          bodyHTML
          title
          number
          closed
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
      }).pipe(map(result => (result.data as QueryDetailsResponse).repository.issue));
  }
}

type ELEMENTS_TO_RETURN = 'first' | 'last';
