import gql from 'graphql-tag';
import {Client} from 'subscriptions-transport-ws';

// quick way to add the subscribe and unsubscribe functions to the network interface
export function addGraphQLSubscriptions(networkInterface: any, wsClient: Client): any {
  return Object.assign(networkInterface, {
    subscribe(request: any, handler: any): number {
      return wsClient.subscribe({
        query: gql(request.query),
        variables: request.variables,
      }, handler);
    },
    unsubscribe(id: number): void {
      wsClient.unsubscribe(id);
    }
  });
}
