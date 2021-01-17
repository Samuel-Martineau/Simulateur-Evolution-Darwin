FROM node:15

LABEL org.opencontainers.image.source https://github.com/Samuel-Martineau/Simulateur-Evolution-Darwin

ENV PORT=8080
ENV PLATFORM="DOCKER"

WORKDIR /app/simulator-core
COPY simulator-core/package.json ./
COPY simulator-core/package-lock.json ./
RUN npm install
COPY simulator-core .
RUN npm run prod

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY postinstall.sh .
RUN yarn
COPY . .
RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]