import { diana } from 'diana-js';
import { withFilter } from 'graphql-subscriptions';

import { tasks } from '../tasks';
import { CHANNEL } from '../config/constant';
import { pubsub } from '../pubsub';

const resolver = {
  Query: {
    tasks: () => tasks,
  },

  Mutation: {
    createTask: async (_: any, { content, from }: any) => {
      const newTask = {
        id: diana(),
        from,
        content,
        status: 'TODO',
      };
      tasks.push(newTask);
      await pubsub.publish(CHANNEL.newTask, { newTask });

      return newTask;
    },
  },

  Subscription: {
    taskSent: {
      resolve: (payload: any) => {
        console.log(payload, '------------payload');
        return payload.taskSent;
      },
      subscribe: withFilter(() => pubsub.asyncIterator(CHANNEL.taskAssignment), (payload, variables) => payload.user === variables.user),
    },
  },
};

export default resolver;
