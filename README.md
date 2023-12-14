# Selfcare App services
App that helps to remember to kind to ourselves and plan activities for a selfcare day


## Version
`0.0.1`

## Demo

[Demo](https://packages-trotter-wmdfs7yiwa-lz.a.run.app/)

## Getting started

Clone the project:

```

```

Install dependencies:
```
cd selfcare-backend && yarn install
```

## Get it up and running

In production
```
yarn start
```

In development
```
yarn dev
```

The default port is 8000 so navigate to localhost:8000

## API

### Users
POST: Expects an object with email and password in the body of the request,
```
/v1/users/signin
```
POST: Expects an array object(s) with email and password in the body of the request,
```
/v1/users/
```
GET: Returns an array of object of the user requested
```
/v1/users/:id
```
PATCH: Returns an array of object of the id of the user updated, accepts an object of
user to be updated
```
/v1/users/:id
```
DELETE: Returns an array of object of the id of the user deleted
```
/v1/users/:id
```

### Tasks
POST: Expects an array object(s) with email and password in the body of the request
```
/v1/users
```
GET : Returns an array of all users
```
/v1/tasks
```
POST: Returns an array of object of the id of new user(s) added, accepts an array of
user(s) to be created
```
/v1/tasks
```
GET: Returns an array of object of the user requested
```
/v1/tasks/:id
```
PATCH: Returns an array of object of the id of the user updated, accepts an object of
user to be updated
```
/v1/tasks/:id
```
DELETE: Returns an array of object of the id of the user deleted
```
/v1/tasks/:id
```

## Testing


Latest coverage report. HTML version of test reports can be found by running the following command or simply view from 
file in /test-report/index.html
```
npx playwright show-report test-report
```
## Design process
