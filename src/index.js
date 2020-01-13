
const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { prisma } = require('./generated/prisma-client/index');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, 'my-secret-from-env-file-in-prod');
    }
    return null;
  } catch (err) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const tokenWithBearer = req.headers.authorization || '';
    const token = tokenWithBearer.split(' ')[1];
    const user = getUser(token);

    return {
      user,
      prisma // the generated prisma client if you are using it
    };
  }
});

server
  .listen({
    port: 4000
  })
  .then(info => console.log(`Server started on http://localhost:${info.port}`));
