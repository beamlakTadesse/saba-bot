# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install pm2 globally
RUN npm install -g pm2

# Copy the rest of the application files
COPY . .

# Expose the port your application listens on
EXPOSE 3000

# Start the application using pm2
CMD [ "pm2-runtime", "src/app.js" ]
