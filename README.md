# Flight Coach Score Client

```bash
docker build -t fcs_client --build-arg TAG=$(git describe --abbrev=0 --tags ) .

docker run --rm -p 5173:5173 --name=fcs_client fcs_client
```

https://khromov.se/the-missing-guide-to-understanding-adapter-static-in-sveltekit/