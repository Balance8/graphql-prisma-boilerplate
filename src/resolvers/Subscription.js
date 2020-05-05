import getUserId from '../utils/getUserId';

//  data flow: Prisma -> Node -> Client (Graphql Playground)
// problem! the data that prisma is sending to node does not align with the data that node is sending to the client, therefore we can lose data as it flows through the application

const Subscription = {};

export { Subscription as default };
