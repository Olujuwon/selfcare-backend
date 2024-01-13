FROM node:21-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .

RUN ls -la

RUN cd functions && npm install

RUN cd ..

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install



# Build the app
RUN npm run build

# ==== RUN =======
# Set the env to "production"
ENV ENV=test
ENV VERSION=0.1.0
ENV DB_CONNECTION_STRING=$DB_CONNECTION_STRING
ENV TEST_DB_CONNECTION_STRING=$TEST_DB_CONNECTION_STRING
ENV FIREBASE_APIKEY=$FIREBASE_APIKEY
ENV FIREBASE_AUTHDOMAIN=$FIREBASE_AUTHDOMAIN
ENV FIREBASE_PROJECTID=$FIREBASE_PROJECTID
ENV FIREBASE_STORAGEBUCKET=$FIREBASE_STORAGEBUCKET
ENV FIREBASE_MESSAGINGSENDERID=$FIREBASE_MESSAGINGSENDERID
ENV FIREBASE_APPID=$FIREBASE_APPID
ENV FIREBASE_MEASUREMENTID=FIREBASE_MEASUREMENTID
ENV APP_CONTEXT=$APP_CONTEXT
ENV API_AUTH_TOKEN=$API_AUTH_TOKEN
ENV DOCKER_USERNAME=$DOCKER_USERNAME
ENV DOCKER_PASSWORD=$DOCKER_PASSWORD
ENV TEST_USER_PASSWORD=$TEST_USER_PASSWORD
ENV TEST_USER_ID=$TEST_USER_ID
ENV FIREBASE_CERT=$FIREBASE_CERT
ENV HOST=$HOST
ENV PORT=$PORT

ENV FILE_ENCODING utf8
# Expose the port on which the app will be running (8080 is the default that `serve` uses)
EXPOSE 8080
# Start the app
CMD [ "npm", "start" ]