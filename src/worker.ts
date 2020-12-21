import { chichi } from 'chichi';

import { CHANNEL } from './config/constant';
import { pubsub } from './pubsub';

const executeWorker = () => {
  // TODO: make worker realtime.
  pubsub.subscribe(CHANNEL.newTask, async (payload: any) => {
    console.log(payload, '----------payload');
    const mockUsers = ['103cuong', 'tvc12', 'admin'];
    await pubsub.publish(CHANNEL.taskAssignment, {
      taskSent: payload.newTask,
      user: mockUsers[chichi(0, mockUsers.length - 1)], // TODO: RR or magic random.
    });
  });
};

export { executeWorker };
