export interface IssuesResponse {
  edges: IssueModel[];
  totalCount?: number;
  issueCount?: number;
  pageInfo: PageInfo;
}

export interface SearchQuery {
  search: IssuesResponse;
}

export interface Query {
  repository: { issues: IssuesResponse };
}

export interface IssueModel {
  node: {
    title: string;
    url: string;
    closed: boolean;
    author: { login: string, __typename: string };
    comments: { totalCount: number, __typename: string };
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
