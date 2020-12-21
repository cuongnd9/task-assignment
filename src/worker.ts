import { chichi } from 'chichi';

import { CHANNEL } from './config/constant';
import { pubsub } from './pubsub';
import { tasks } from './tasks';

const executeWorker = () => {
  // TODO: make worker realtime.
  pubsub.subscribe(CHANNEL.newTask, (payload: any) => {
    tasks.push(payload.newTask);
  });

  setInterval(async () => {
    const mockUsers = ['103cuong', 'tvc12', 'admin']; // available user
    const tasksWithTodoStatus = tasks.filter((task) => task.status === 'TODO');
    if (tasksWithTodoStatus.length > 0) {
      const selectedIndex = chichi(0, tasksWithTodoStatus.length - 1);
      await pubsub.publish(CHANNEL.taskAssignment, {
        taskSent: tasksWithTodoStatus[selectedIndex],
        user: mockUsers[chichi(0, mockUsers.length - 1)], // TODO: RR or magic random.
      });
      tasksWithTodoStatus[selectedIndex].status = 'IN_PROCESS';
    }
  }, 1000);
};

export { executeWorker };
