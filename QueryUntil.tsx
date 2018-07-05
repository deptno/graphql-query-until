import * as React from 'react'
import {Query} from 'react-apollo'
import {DocumentNode} from 'graphql'

export const QueryUntil: React.SFC<Props> = (props) => {
  const {data: prev, query, variables, merge, getNextCursor, cursorProp, children} = props

  return (
    <Query query={query} variables={variables}>
      {(context) => {
        const {data, loading} = context

        if (!loading && data) {
          const cursor = getNextCursor(data)

          if (cursor) {
            return (
              <QueryUntil
                query={query}
                variables={{
                  ...variables,
                  [cursorProp]: cursor
                }}
                data={merge(prev, data)}
                getNextCursor={getNextCursor}
                merge={merge}
              >
                {children}
              </QueryUntil>
            )
          }
          return children({...context, data: merge(prev, data)})
        }

        return children({...context, data: prev})
      }}
    </Query>
  )
}
QueryUntil.defaultProps = {
  cursorProp: 'cursor',
  variables: {
    [this.cursorProp]: null,
  }
}

interface Props<Props = any, Data = any, Variables = any> {
  query: DocumentNode
  merge: (prev: Partial<Data>, next: Data) => Partial<Data>
  children: (result) => React.ReactNode;
  getNextCursor?: (data: Data) => string|undefined
  variables?: Variables
  data?: Data
  cursorProp?: string
}
