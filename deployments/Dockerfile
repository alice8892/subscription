FROM --platform=linux/amd64 node:22-alpine
ENV NODE_ENV production
WORKDIR /app
COPY package*.json .
COPY databases ./databases
RUN npm ci --omit-dev
COPY build ./build
CMD ["npm", "start"]
