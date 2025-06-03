FROM node:22
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev
# Bundle app source
COPY . .
# Expose the port the app runs on
EXPOSE 5001
# Start the app
CMD [ "npm", "start" ]
# Healthcheck to ensure the app is running

