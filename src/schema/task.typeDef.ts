const typeDef = `
  type Query {
    tasks: [Task]
  }
  type Mutation {
    createTask(content: String!, from: String!) : Task
  }
  type Subscription {
    taskSent(user: String!): Task
  }
  enum Status {
    TODO
    IN_PROCESS
    DONE
    FAILED
  }
  type Task {
    id: ID
    content: String
    from: String
    status: Status
  }
`;

export default typeDef;
