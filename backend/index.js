require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');

const typeDefs = require('./typeDefs/schema');
const resolvers = require('./resolvers');
const auth = require('./middleware/auth');

const startServer = async () => {
  const app = express();
  
  // CORS ayarları - Vercel ve local geliştirme için
  app.use(cors({
    origin: ['https://your-vercel-app-url.vercel.app', 'http://localhost:4202'],
    credentials: true
  }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => auth(req),
  });

  await server.start();
  server.applyMiddleware({ app });

  await mongoose.connect(process.env.MONGO_URI);
  console.log('🚀 MongoDB connected');

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
