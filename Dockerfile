###########################################################
#
# Dockerfile for micro-auth-ldap
#
###########################################################

# Setting the base to nodejs 7.5.0
FROM node:7.5.0-alpine

# Maintainer
MAINTAINER Geir Gåsodden

# Bundle app source
COPY . /src

# Change working directory
WORKDIR "/src"

# Install dependencies
RUN npm install --production

# Expose 8080
EXPOSE 8080

# Startup
ENTRYPOINT npm start