import React from 'react'
import { Flex, Text } from 'rebass'
import { createRefetchContainer, graphql } from 'react-relay'
import { Card, Content, Button } from '@workshop/ui'

const App = ({ feed }) => {
    const error = false

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
                    {feed.posts.edges.map(({ node }) => (
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

export default createRefetchContainer(
  App,
  {
    feed: graphql`
      fragment App_feed on Query
      @argumentDefinitions(
        count: {type: "Int", defaultValue: 10}
      ) {
        posts(first: $count) {
          edges {
            node {
              id
              content
            }
          }
        }
      }
    `
  },
  graphql`
    # Notice that we re-use our fragment and the shape of this query matches our fragment spec.
    query AppRefetchQuery($count: Int) {
        ...App_feed @arguments(count: $count)
    }
  `,
);
