import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma.js';

const userOne = {
  input: {
    name: 'Amanda',
    email: 'amanda_seed@example.com',
    password: bcrypt.hashSync('Shinji098!@#$'),
  },
  user: undefined,
  jwt: undefined,
};

const userTwo = {
  input: {
    name: 'Michael',
    email: 'michael_seed@example.com',
    password: bcrypt.hashSync('APASSFORMICHAEL'),
  },
  user: undefined,
  jwt: undefined,
};

const seedDatabase = async () => {
  // Delete Test Data
  await prisma.mutation.deleteManyUsers();

  // Create User One
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  // Create User Two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);
};

export { seedDatabase as default, userOne, userTwo };
