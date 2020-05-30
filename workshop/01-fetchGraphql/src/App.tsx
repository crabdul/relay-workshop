import React, { Suspense } from 'react'
import { Flex, Text } from 'rebass'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import {
    graphql,
    preloadQuery,
    usePreloadedQuery,
    RelayEnvironmentProvider,
} from 'react-relay/hooks'
import { Card, Content, Button } from '@workshop/ui'
import { AppQuery } from './__generated__/AppQuery.graphql.js'

function fetchQuery(operation, variables) {
    return fetch('http://localhost:7500/graphql', {
        method: 'POST',
        credentials: 'same-origin', // 启用 cookie
        headers: {
            'Content-Type': 'application/json',
        }, // Add authentication and other headers here
        body: JSON.stringify({
            query: operation.text, // GraphQL text from input
            variables,
        }),
    }).then(response => {
        return response.json()
    })
}

const environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
})

const query = graphql`
    query AppQuery {
        posts {
            edges {
                node {
                    id
                    content
                }
            }
        }
    }
`

const result = preloadQuery(
    environment,
    query,
    { first: '5' },
    { fetchPolicy: 'store-or-network' }
)

const App = () => {
    const error = false
    const data = usePreloadedQuery<AppQuery>(query, result)

    if (!data) {
        return (
            <Content>
                <Text>Error: {error}</Text>
                <Button mt="10px">retry</Button>
            </Content>
        )
    }

    return (
        <Content>
            <Flex flexDirection="column">
                <Text>Posts</Text>
                <Flex flexDirection="column">
                    {data.posts.edges.map(({ node }) => (
                        <Card
                            key={node.id}
                            mt="10px"
                            flexDirection="column"
                            p="10px"
                        >
                            <Text>id: {node.id}</Text>
                            <Text>content: {node.content}</Text>
                        </Card>
                    ))}
                </Flex>
            </Flex>
            <Button>Prev</Button>
            <Button>Next</Button>
        </Content>
    )
}

/* const App = React.lazy(() => import('./App')); // Lazy-loaded */

export default () => (
    <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback={<div>Loading</div>}>
            <App />
        </Suspense>
    </RelayEnvironmentProvider>
)
