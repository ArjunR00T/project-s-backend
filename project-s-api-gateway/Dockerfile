FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
# This Dockerfile sets up a Node.js application in a Docker container.

