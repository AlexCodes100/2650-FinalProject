# Use an official node image as the base image
FROM node:22

# Set the working directory
WORKDIR /App

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Serve the React app using serve
RUN npm install -g serve

# Command to run the app
CMD ["serve", "-s", "build"]
