# Flight Coach Score Client


The client is now a static site here (should load for offline use in a service worker):
https://pyflightcoach.github.io/FCScoreClient/

you can run the new server directly on your machine from docker hub:
```bash
    docker run --rm -p 5000:5000 --name=fcs_server thomasdavid/fcs-server:v0.1.0
```

You can now see API documentation once the server is running by visiting:
http://localhost:5000/redoc or http://localhost:5000/docs

To run a development version locally:
```bash
    npm install
    npm run dev
```

To build and run locally
```bash
    npm run build
    npm run preview
```

To build and run a docker image:
```bash
    docker build -t fcs_client .
    docker run --rm -p 5173:80 --name=fcs_client fcs_client
```
