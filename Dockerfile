FROM node:22-alpine
WORKDIR /app
EXPOSE 5173
COPY . .
ARG TAG
RUN npm install
ENTRYPOINT ["npm", "run", "dev" , "--", "--host"]