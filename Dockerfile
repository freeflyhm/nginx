# Set nginx base image
FROM nginx:stable-alpine

# File Author / Maintainer
MAINTAINER joehe

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf
COPY web /web
