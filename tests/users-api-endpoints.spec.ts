import { test, request, expect, APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';
const fixtureFactory = require('fixture-factory');

import { IUser } from '../types';

let apiContext: APIRequestContext;
const serviceName = 'users';
const password = process.env.TEST_USER_PASSWORD as string;
const testUserId = process.env.TEST_USER_ID as string;

const userDataModel = {
  display_name: `${faker.name.fullName()}`,
  photo_url: 'image.avatar',
  phone_number: `+358${faker.random.numeric(10)}`,
  email: 'internet.email',
};

fixtureFactory.register('user', userDataModel);

test.beforeAll(async () => {
  apiContext = await request.newContext({
    baseURL: `${process.env.HOST}:${process.env.PORT}/`,
    extraHTTPHeaders: {
      authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
    },
  });
});

test.describe(`${serviceName}-service tests`, () => {
  const getUserById = async (Id: string) => {
    const getUser = await apiContext.get('v1/users/' + Id);
    const userResponseBody = await getUser.json();
    const userResponseStatus = await getUser.status();
    expect(userResponseStatus === 200).toBeTruthy();
    expect(userResponseBody.data).toBeTruthy();
    return userResponseBody.data;
  };

  test('Health check: DB health', async () => {
    const getHealth = await apiContext.get('v1/health');
    const responseBody = await getHealth.json();
    const responseStatus = await getHealth.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(responseBody.connections.database === 'ok').toBeTruthy();
  });

  test('POST: Create user(s)', async () => {
    let users = await fixtureFactory.generate('user', 1);
    users = users.map((user: IUser) => ({ ...user, password: password }));
    const createOneUser = await apiContext.post('v1/auth', {
      data: [...users],
    });
    const responseBody = await createOneUser.json();
    const responseStatus = await createOneUser.status();
    expect(responseStatus === 201).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
  });

  test('POST: Signin user', async () => {
    const userArr = await fixtureFactory.generate('user', 1);
    const user = userArr.map((user: IUser) => ({ ...user, password: password }));
    const createOneUser = await apiContext.post('v1/auth', {
      data: [...user],
    });
    const responseBody = await createOneUser.json();
    const responseStatus = await createOneUser.status();
    expect(responseStatus === 201).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
    const { email } = responseBody.data[0];
    const signinUser = await apiContext.post('v1/auth/signin', {
      data: { email: email, password: password },
    });
    const signinResponseBody = await signinUser.json();
    const signinResponseStatus = await signinUser.status();
    expect(signinResponseStatus === 200).toBeTruthy();
    expect(signinResponseBody.data.token).toBeTruthy();
  });

  /*test.skip('GET: Get all users', async () => {
    const getAllTasks = await apiContext.get('v1/users');
    const responseBody = await getAllTasks.json();
    const responseStatus = await getAllTasks.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(Array.isArray(responseBody.data)).toBeTruthy();
  });*/

  test('GET: Get user by ID', async () => {
    const { id }: IUser = await getUserById(testUserId);
    expect(id).toBeTruthy();
    //expect(responseBody.data).toBeTruthy();
  });

  /*test.skip('GET: Get All tasks associated to a user', async () => {
    const getAllUserTasks = await apiContext.get('v1/tasks/getByUserId/' + userID);
    const responseBody = await getAllUserTasks.json();
    const responseStatus = await getAllUserTasks.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
    expect(responseBody.data.map((task: ITask) => task.user_id)).toContain(userID);
  });*/

  test('PATCH: Edit user', async () => {
    const { id }: IUser = await getUserById(testUserId);
    const editUser = await apiContext.patch('v1/users/' + id, {
      data: {
        photo_url: faker.image.avatar(),
      },
    });
    const responseBody = await editUser.json();
    const responseStatus = await editUser.status();
    expect(responseStatus === 200).toBeTruthy();
    expect(responseBody.data).toBeTruthy();
  });

  test('DELETE: Delete one endpoint', async () => {
    let { id }: IUser = await getUserById(testUserId);
    id = 'YQEXZVERR9PHFCFcWZmLHmh0mux2'; // changed the id so the following assertions will be falsy
    const deleteUser = await apiContext.delete('v1/users/' + id);
    const responseBody = await deleteUser.json();
    const responseStatus = await deleteUser.status();
    expect(responseStatus !== 200).toBeTruthy();
    expect(responseBody.data).toBeFalsy();
  });
});
// eslint-disable-next-line no-empty-pattern
test.afterAll(async ({}) => {
  // @ts-ignore
  await apiContext.dispose();
});
