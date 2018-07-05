# React Apollo Query Until

`react-apollo-query-until` is designed for special case of SSR.

If you need to fetch data until last(or specific) **cursor(offset)**, but `apollo-client` `<Query>`'s fetchMore doesn't seem to work in SSR(by `getDataFromTree` function).  
So I tried to handle `<Query>` recursive way, and it works.

`react-apollo-query-until` is helper to handle this case. works {server, client} side both.

## Installation

`npm install react-apollo-query-until`

## Usage

### Interface 
```typescript
interface Props<Props = any, Data = any, Variables = any> {
  query: DocumentNode
  getNextCursor: (data: Data) => string|undefined
  merge: (prev: Partial<Data>, next: Data) => Partial<Data>
  cursorProp?: string
  variables?: Variables
  data?: Data
}
```

> M: Mandatory, O: Optional

- [M] query - GraphQL query to fetch after next cursor, created via `graphql-tag`.
- [M] variables - GraphQL query variables. It will be use it recursively
- [M] data - If you start from legacy data(from other query), use as initial data.
- [O] cursorProp - Merge next cursor property name with `variables`, fallthrough recursively, if next fetch is required. (default: 'cursor').
- [O] getNextCursor - If you need more fetching data, return next cursor. It will be called every time data is fetched.
- [O] merge - Data accumulator.

```typescript
QueryUntil.defaultProps = {
  cursorProp: 'cursor',
  variables: {
    [this.cursorProp]: null,
  }
}
````

> If you specified `cursorProp`, you MUST set `variables` to include cursor property you specified, eg, `{[cursorProps]: null}`

### example

> Use github GraphQL API

```typescript jsx
import * as React from 'react'
import {QueryUntil} from 'react-apollo-query-until'

const User: React.SFC<{user: any}> = /* implement some component */

export const QLGithubUser: React.SFC = () =>
  <QueryUntil
    query={query}
    getNextCursor={data => {
      const {hasNextPage, endCursor} = data.user.repositories.pageInfo
      
      if (hasNextPage) {
        return endCursor
      }
    }}
    merge={(prev, data) => !prev
      ? data
      : {
      ...prev,
      user: {
        ...prev.user,
        repositories: {
          ...prev.user.repositories,
          nodes   : prev.user.repositories.nodes.concat(data.user.repositories.nodes),
          pageInfo: data.user.repositories.pageInfo
        }
    }}}
  >
    {({data, loading, fetchMore}) => (loading || !data) ? 'Loading...' : <User {...data}/> }
  </QueryUntil>
```

## LICENSE

MIT
