// Import express and the Neo4j driver
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config({path : './.env'});

export const neo4jconfig = {
  project: process.env.NEO4JPROJECT,
  host: process.env.NEO4JHOST,
  port: process.env.NEO4JPORT,
  DBMS: process.env.NEO4JDBMS,
  database: process.env.NEO4JDATABASE,
  user: process.env.NEO4JUSER,
  password: process.env.NEO4JPASSWORD,
};


export const driver = neo4j.driver(
  `bolt://${neo4jconfig.host}:${neo4jconfig.port}`, //neo4j: if more than 1 dbms
  neo4j.auth.basic(neo4jconfig.user, neo4jconfig.password),
  {
    maxConnectionPoolSize: 100,
    connectionTimeout: 30000, // 30 seconds
    encrypted: 'ENCRYPTION_OFF',
    logging: {
      level: 'info',
      logger: (level, message) => console.log(level + ' ' + message)
    },
  }
);
