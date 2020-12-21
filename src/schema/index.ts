import { makeExecutableSchema } from 'graphql-tools';
import resolver from './task.resolver';
import typeDef from './task.typeDef';

const schema = makeExecutableSchema({ typeDefs: [typeDef], resolvers: [resolver] });

export { schema };
