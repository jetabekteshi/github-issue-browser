export interface IssuesResponse {
  edges: IssueModel[];
  totalCount?: number;
  issueCount?: number;
  pageInfo: PageInfo;
}

export interface SearchQuery {
  search: IssuesResponse;
}

export interface QueryListResponse {
  repository: { issues: IssuesResponse };
}

export interface QueryDetailsResponse {
  repository: { issue: IssueDetails };
}

export interface IssueModel {
  node: {
    title: string;
    url: string;
    closed: boolean;
    author: { login: string };
    bodyHTML: string;
    comments: { totalCount: number };
    createdAt: string;
    closedAt: string;
    number: number;
  };
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
}

export type StateType = 'OPEN' | 'CLOSED';

export interface IssueDetails {
  author: { login: string, __typename: string };
  bodyHTML: string;
  number: number;
  title: string;
  comments: { totalCount: number, edges: IssueModel[] };
}
