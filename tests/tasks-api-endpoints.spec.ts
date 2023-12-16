import { test, request, expect, APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';
const fixtureFactory = require('fixture-factory');
import * as dotenv from 'dotenv';

import { ITask } from '../types';

dotenv.config();

let apiContext: APIRequestContext;
const serviceName = 'tasks';
const userID = faker.random.numeric(1, { allowLeadingZeros: false });

const taskDataModel = {
  name: 'lorem.words',
  description: 'lorem.paragraphs',
  schedule: 'date.future',
  user_id: userID,
  status: 'active',
};

fixtureFactory.register('task', taskDataModel);

test.beforeAll(async () => {
  apiContext = await request.newContext({
    baseURL: `${process.env.HOST}:${process.env.PORT}/`,
    extraHTTPHeaders: {
      authorization: `Bearer ${process.env.TOKEN}`,
    },
    timeout: 50000,
  });
});

test.describe(`${serviceName}-service tests`, () => {
  const getTask = async () => {
    const getAllTasks = await apiContext.get('v1/tasks');
    const allTasksResponseBody = await getAllTasks.json();
    const allTasksResponseStatus = await getAllTasks.status();
    expect(allTasksResponseStatus === 200).toBeTruthy();
    expect(Array.isArray(allTasksResponseBody.data)).toBeTruthy();
    const task: ITask = allTasksResponseBody.data[0];
    return task;
  };

  test('Health check:DB health', async () => {
    const getHealth = await apiContext.get('v1/health');
    const responseBody = await getHealth.json();
    const responseStatus = await getHealth.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(responseBody.connections.database === 'ok').toBeTruthy();
  });

  test('POST: Create tasks', async () => {
    const tasks = fixtureFactory.generate('task', 2);
    const createOneTask = await apiContext.post('v1/tasks', {
      data: [...tasks],
    });
    const responseBody = await createOneTask.json();
    const responseStatus = await createOneTask.status();
    expect(responseStatus === 201).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
  });

  test('GET: Get all tasks', async () => {
    const getAllTasks = await apiContext.get('v1/tasks');
    const responseBody = await getAllTasks.json();
    const responseStatus = await getAllTasks.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(Array.isArray(responseBody.data)).toBeTruthy();
  });

  test('GET: Get One task by task ID', async () => {
    const { id }: ITask = await getTask();
    const getOneTaskById = await apiContext.get('v1/tasks/' + id);
    const responseBody = await getOneTaskById.json();
    const responseStatus = await getOneTaskById.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
  });

  test('GET: Get All tasks associated to a user', async () => {
    const getAllUserTasks = await apiContext.get('v1/tasks/getByUserId/' + userID);
    const responseBody = await getAllUserTasks.json();
    const responseStatus = await getAllUserTasks.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
    expect(responseBody.data.map((task: ITask) => task.user_id)).toContain(userID);
  });

  test('PATCH: Edit a task', async () => {
    const { id }: ITask = await getTask();
    const editUser = await apiContext.patch('v1/tasks/' + id, {
      data: {
        description: 'debitis consectetur voluptatem non doloremque ipsum autem totam eum ratione',
      },
    });
    const responseBody = await editUser.json();
    const responseStatus = await editUser.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
  });

  test('DELETE: Delete a task', async () => {
    const { id }: ITask = await getTask();
    const deleteTask = await apiContext.delete('v1/tasks/' + id);
    const responseBody = await deleteTask.json();
    const responseStatus = await deleteTask.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
  });
});
// eslint-disable-next-line no-empty-pattern
test.afterAll(async ({}) => {
  // @ts-ignore
  await apiContext.dispose();
});
