import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {setContext} from 'apollo-link-context';


const uri = 'https://api.github.com/graphql';

export function provideApollo(httpLink: HttpLink) {

  const token = 'fb07e76f9e98369ea6ee4466cc4a4fe2489cefca';
  const auth = setContext(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    },
  }));
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: []
      },
    },
  });
  const link = ApolloLink.from([auth, httpLink.create({uri})]);
  const cache = new InMemoryCache({fragmentMatcher});

  return {
    link,
    cache
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
