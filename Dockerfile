FROM node:22-alpine
WORKDIR /app
EXPOSE 5173
COPY . .
ARG TAG
ENV PUBLIC_VERSION $TAG
RUN echo "TAG = $PUBLIC_VERSION"
RUN npm install
ENTRYPOINT ["npm", "run", "dev" , "--", "--host"]