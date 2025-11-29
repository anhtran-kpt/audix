FROM node:25-alpine


RUN apk update && apk add --no-cache python3 py3-pip ffmpeg


WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]