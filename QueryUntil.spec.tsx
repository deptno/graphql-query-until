import 'isomorphic-fetch'
import * as React from 'react'
import {QueryUntil} from './QueryUntil'
import gql from 'graphql-tag'
import ApolloClient, {InMemoryCache} from 'apollo-boost'
import {ApolloProvider, getDataFromTree} from 'react-apollo'

//todo: find public graphql server
const client = new ApolloClient({
  cache: new InMemoryCache().restore({}),
  uri    : ''
})

//todo: write query
const query = gql`
`
const Spinner: React.SFC = (props) => <p>Loading...</p>

describe('graphql query until', () => {
  it('QueryUntil', async done => {
    await getDataFromTree(
      <ApolloProvider client={client}>
        {
          //use query until
        }
      </ApolloProvider>
    )
    //todo: verify data
    done()
  })
})
