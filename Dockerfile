FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV production
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
