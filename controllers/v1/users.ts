import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import * as dotenv from 'dotenv';
import { IUser } from '../../types';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MEASUREMENTID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

if (process.env.APP_CONTEXT === 'develop') {
  connectAuthEmulator(firebaseAuth, 'http://127.0.0.1:9099');
}

const _convertFirebaseUserRecordToSelfcareFormat = (userRecord: any) => {
  const selfcareUser: IUser = { display_name: '', email: '', phone_number: '', photo_url: '' };
  Object.keys(userRecord).forEach((key) => {
    switch (key) {
      case 'uid':
        selfcareUser.id = userRecord[key];
        break;
      case 'displayName':
        selfcareUser.display_name = userRecord[key];
        break;
      case 'email':
        selfcareUser.email = userRecord[key];
        break;
      case 'photoURL':
        selfcareUser.photo_url = userRecord[key];
        break;
      case 'phoneNumber':
        selfcareUser.phone_number = userRecord[key];
        break;
      case 'stsTokenManager':
        selfcareUser.token = userRecord[key].accessToken;
        break;
      default:
    }
  });
  return selfcareUser;
};

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const { email: userEmail, password } = request.body as any;
  try {
    const { user } = await signInWithEmailAndPassword(firebaseAuth, userEmail, password);
    const authenticatedUser = _convertFirebaseUserRecordToSelfcareFormat(user.toJSON());
    reply.code(200).send({
      version: _version,
      data: authenticatedUser,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};
export const queryAll = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = 'users';
  // @ts-ignore
  const { knex } = request.server as FastifyInstance;
  try {
    const queryAll = await knex(_serviceName).select().timeout(1000, { cancel: true });
    reply.code(200).send({
      version: _version,
      data: queryAll,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};

export const queryById = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const { firebase } = request.server as any;
  const { id } = request.params as any;
  try {
    const getOneById = await firebase.auth().getUser(id);
    const user = _convertFirebaseUserRecordToSelfcareFormat(getOneById.toJSON());
    reply.code(200).send({
      version: _version,
      data: user,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};
export const insertNew = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const usersToCreate = request.body as IUser[];
  try {
    const allPromises: Promise<any>[] = [];
    usersToCreate.forEach((user) => {
      const { password, email } = user;
      allPromises.push(createUserWithEmailAndPassword(firebaseAuth, email, password as string));
    });
    let usersCreated = await Promise.all(allPromises);
    usersCreated = usersCreated.map((userRecord) => {
      return _convertFirebaseUserRecordToSelfcareFormat(userRecord.user.toJSON());
    });
    reply.code(201).send({
      version: _version,
      data: usersCreated,
      status: 201,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};
export const updateById = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const { firebase } = request.server as FastifyInstance;
  const updatesFromUi = request.body as IUser;
  const fieldsWhiteList: string[] = ['email', 'password', 'phone_number', 'display_name', 'photo_url', 'disabled'];
  let updateObject: any = {};
  const { id } = request.params as any;
  Object.keys(updatesFromUi).forEach((key: any) => {
    if (fieldsWhiteList.includes(key)) {
      // @ts-ignore
      updateObject = { ...updateObject, [key]: updatesFromUi[key] };
    } else return;
  });
  try {
    const updateQuery = await firebase.auth().updateUser(id, updateObject);
    const updatedUser = _convertFirebaseUserRecordToSelfcareFormat(updateQuery.toJSON());
    reply.code(200).send({
      version: _version,
      data: updatedUser,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};

export const deleteById = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const { firebase } = request.server as FastifyInstance;
  const { id } = request.params as any;
  try {
    await firebase.auth().deleteUser(id);
    reply.code(200).send({
      version: _version,
      data: `User with ID ${id} deleted successfully`,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};
