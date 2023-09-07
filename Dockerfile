FROM node:16-alpine
WORKDIR /app
EXPOSE 5173
COPY . .
ENTRYPOINT ["npm", "run", "dev", "--", "--host"]