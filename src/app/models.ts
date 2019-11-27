export interface IssuesResponse {
  data: { repository: { issues: { edges: IssueModel[]; totalCount: number; pageInfo: PageInfo } } };
}

export interface IssueModel {
  node: {
    title: string;
    url: string;
    author: { login: string, __typename: string };
    comments: { totalCount: number, __typename: string };
    updatedAt: string;
    number: number;
  };
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
}

export type StateType = 'OPEN' | 'CLOSED';
