import { diana } from 'diana-js';
import { withFilter } from 'graphql-subscriptions';

import { tasks } from '../tasks';
import { CHANNEL } from '../config/constant';
import { pubsub } from '../pubsub';

const withUnsubscribe = (asyncIterator: any, onCancel: any) => {
  const asyncReturn = asyncIterator.return;

  // eslint-disable-next-line no-param-reassign
  asyncIterator.return = () => {
    onCancel();
    return asyncReturn ? asyncReturn.call(asyncIterator) : Promise.resolve({ value: undefined, done: true });
  };

  return asyncIterator;
};

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
      await pubsub.publish(CHANNEL.newTask, { newTask });

      return newTask;
    },
  },

  Subscription: {
    taskSent: {
      resolve: (payload: any) => payload.taskSent,
      subscribe: withFilter(
        (rootValue: any, args: any, context: any) => {
          console.log(context, '------------------subscribe');
          return withUnsubscribe(pubsub.asyncIterator(CHANNEL.taskAssignment), () => {
            console.log(context, '--------------unsubscribe');
          });
        },
        (payload, variables) => payload.user === variables.user
      ),
    },
  },
};

export default resolver;
