# Use the official Node.js image
FROM node:18

# Create and change to the app directory
WORKDIR /app

# Install bash
RUN apt-get update && apt-get install -y bash

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy wait-for-it script
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app using wait-for-it
CMD ["wait-for-it.sh", "mysql:3306", "--", "node", "server.js"]
