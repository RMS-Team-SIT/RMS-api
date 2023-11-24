# Stage 1: Build the application
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
