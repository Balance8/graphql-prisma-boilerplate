import getUserId from '../utils/getUserId';
import { Prisma } from 'prisma-binding';

const Query = {
  users(parent, args, { prisma }, info) {
    // prisma.query.x(null (operation args), x)
    // nothing, string, object are all valid options for the second argument
    // if nothing, primsa will fall back to default which is all scalar fields
    // string: explictly state what you need, but will not work if info is coming from client which is variable
    // object: object that is created for us is the info object. This contains all the information about the original operation

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(opArgs, info);
  },

  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId,
      },
    });
  },
};

export { Query as default };
