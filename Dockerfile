FROM node:20.0.0-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install
# Build the app
RUN npm run build

# ==== RUN =======
# Set the env to "production"
ENV ENV develop
ENV VERSION 0.0.1
ENV PORT=${PORT}
ENV SERVICE_NAME=${SERVICE_NAME}
ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_PASS=${DB_PASS}
ENV DB_NAME=${DB_NAME}
ENV DB_PORT=${DB_PORT}
ENV DB_CLIENT=${DB_CLIENT}
ENV FILE_ENCODING utf8
# Expose the port on which the app will be running (8080 is the default that `serve` uses)
#EXPOSE 8004
# Start the app
CMD [ "npm", "start" ]