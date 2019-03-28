#########################
### build environment ###
#########################

# base image
FROM node:11.6 as builder

# install chrome for tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install --no-install-recommends -yq google-chrome-stable

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# add app
COPY . /usr/src/app

# install dependencies
RUN npm install

# lint
RUN ng lint

# test
RUN ng test --watch=false --browsers ChromeHeadlessNoSandbox

# build
RUN ng build --prod

##################
### production ###
##################

# base image
FROM nginx:1.15.6-alpine

# copy artifact build from the builder
COPY --from=builder /usr/src/app/dist/aisle /usr/share/nginx/html
COPY ./nginx_app.conf /etc/nginx/conf.d/default.conf
COPY ./nginx_auth /etc/nginx/.htpasswd
COPY ./docker-run.sh /

# Use iso8601 time format in access logs
RUN sed -i "s/time_local/time_iso8601/" /etc/nginx/nginx.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["/bin/sh", "/docker-run.sh"]
