import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '2 weeks',
  });

  return token;
};

export { generateToken as default };
