import ApolloClient, {createBatchingNetworkInterface} from 'apollo-client';
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws/dist/client';

// Polyfill fetch
import 'whatwg-fetch';

interface Result {
  id?: string;
  __typename?: string;
}

const wsClient: SubscriptionClient = new SubscriptionClient('ws://localhost:8080', {
  reconnect: true
});

const networkInterface: any = createBatchingNetworkInterface({
  uri: '/graphql',
  batchInterval: 10,
  opts: {
    credentials: 'same-origin',
  }
});

const networkInterfaceWithSubscriptions: any = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client: ApolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: (result: Result) => {
    if (result.id && result.__typename) {
      return result.__typename + result.id;
    }
    return null;
  }
});

export function provideClient(): ApolloClient {
  return client;
}
