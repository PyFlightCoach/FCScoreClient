# Flight Coach Score Client

docker build -t fcs_client --build-arg SOURCE_COMMIT=$(git rev-parse HEAD) .

docker run --rm -p 5173:5173 --name=fcs_client fcs_client
