import React from 'react'
import { defineComponent } from 'reactivue'
import { useQuery } from 'villus'

const Posts = `
{
  company {
    founded
    name
  }
}
`

export const Query = defineComponent(
  () => {
    // useClient({
    //   url: 'https://api.spacex.land/graphql/', // your endpoint.
    // })

    // without variables
    const { data } = useQuery({
      query: Posts,
    })

    return { data }
  },
  ({ data }) => {
    return (
      <div className="card">
        <p>useQuery</p>
        <pre className="p-1">{ !data ? 'Loading' : JSON.stringify(data, null, 2) }</pre>
      </div>
    )
  },
)
