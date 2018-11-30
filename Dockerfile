#########################
### build environment ###
#########################

# base image
FROM node:11.2.0 as builder

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g @angular/cli@7.0.3 --unsafe

# add app
COPY . /usr/src/app

# generate build
RUN npm run build

##################
### production ###
##################

# base image
FROM nginx:1.15.6-alpine

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/dist/aisle /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
