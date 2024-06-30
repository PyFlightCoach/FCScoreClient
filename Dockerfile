FROM node:alpine as build-deps
WORKDIR /usr/src/app
COPY . .
ARG TAG
RUN npm install
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]