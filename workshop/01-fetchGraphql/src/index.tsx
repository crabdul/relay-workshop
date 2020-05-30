import 'isomorphic-fetch';
import React from 'react';
import { ReactRelayContext, graphql, QueryRenderer } from 'react-relay'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { createRoot } from 'react-dom';

import App from './App';


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


createRoot(document.getElementById('root')).render(
    <ReactRelayContext.Provider environment={environment}>
    <QueryRenderer
        environment={environment}
        query={graphql`
            query srcQuery {
                ...App_feed
            }
        `}
        variables={{
            count: 10
        }}
        render={App}
    />

    </ReactRelayContext.Provider>
);
