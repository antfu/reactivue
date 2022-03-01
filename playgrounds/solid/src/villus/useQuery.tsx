import { defineComponent } from 'reactivue/solid'
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
    const { data, execute, isFetching } = useQuery({
      query: Posts,
      cachePolicy: 'network-only',
    })

    return { data, execute, isFetching }
  },
  ({ data, execute, isFetching }) => {
    return (
      <div className="card">
        <p>useQuery</p>
        <button onClick={() => execute()}>Refetch</button>
        <pre className="p-1">{ isFetching() ? 'Loading' : JSON.stringify(data(), null, 2) }</pre>
      </div>
    )
  },
)
