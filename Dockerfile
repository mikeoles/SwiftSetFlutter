#########################
### build environment ###
#########################

# base image
FROM node:11.6 as builder

# install chrome for tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g @angular/cli@7.2.2 --unsafe

# add app
COPY . /usr/src/app

# lint
RUN ng lint

# tests
RUN ng test --watch=false --browsers ChromeHeadlessNoSandbox

# generate build
RUN npm run build

##################
### production ###
##################

# base image
FROM nginx:1.15.6-alpine

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/dist/aisle /usr/share/nginx/html
COPY ./docker-run.sh /

# expose port 80
EXPOSE 80

# run nginx
CMD ["/bin/sh", "/docker-run.sh"]
