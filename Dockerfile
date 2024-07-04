# Use the official Node.js 14 image.
FROM node:14-alpine

# Create and change to the app directory.

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Make the port 5000 available to the world outside this container.
EXPOSE 5000

# Run the web service on container startup.
CMD ["node", "./build/connection/server/index.js"]