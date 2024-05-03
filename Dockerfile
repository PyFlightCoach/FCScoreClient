FROM node:16-alpine
WORKDIR /app
EXPOSE 5173
COPY . .
ARG TAG
ENV PUBLIC_VERSION $TAG
RUN echo "TAG = $PUBLIC_VERSION"
ENTRYPOINT ["npm", "run", "dev", "--", "--host"]