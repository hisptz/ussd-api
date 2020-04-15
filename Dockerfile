 
FROM node:10.18.1-alpine3.11

RUN mkdir /home/app
WORKDIR /home/app
COPY package.json /home/app
COPY . /home/app
CMD npm run start_all
EXPOSE 3000