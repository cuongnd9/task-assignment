import { diana } from 'diana-js';

const tasks = [
  {
    id: diana(), from: 'admin', content: 'testing 1', status: 'DONE',
  },
  {
    id: diana(), from: '103cuong', content: 'testing 2', status: 'TODO',
  },
];

export { tasks };
