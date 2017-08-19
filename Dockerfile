# Light nodejs version including npm
FROM mhart/alpine-node:latest

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 8080

CMD ["sh", "-c", "NODE_ENV=DOCKER PORT=8080 npm start"]