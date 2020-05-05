import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

// Take in password -> Validate Password -> Hash password -> Generate auth token
// JSON Web Token (JWT) - iat = intialized at time
// server generates token, client gets the token, client can use token for future requests

// Enum
// 1. A special type that defines a set of constants
// 2. This type can then be used as the type for a field (similar to scalar and custom object types)
// 3. Values for the field must be one of the constants for the type

// UserRole - standard, editor, admin

// type User{
//  role: UserRole!
// }

// laptop.isOn - true - false
// latop.powerStatus - on - off - sleep / enum gives us more then boolean
// if some one tries to save without one of these types it gets rejected

// Password Demo:
// const dummy = async () => {
//   const email = 'test.com';
//   const password = 'asdasdnewpass';

//   const hashedPassword =
//     '$2a$10$yL1QwvygvSRqFsBn3WcA/.xvt.96z/MT1gIYk7ayNtRrwv4C8wY4i';

//   const isMatch = await bcrypt.compare(password, hashedPassword);
//   console.log(isMatch);
// };
// dummy();

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error('No User Found');
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);

    // password123 -> apppepfasdfpfklqwe123 ONE WAY HASH

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    );
  },
};

export { Mutation as default };
