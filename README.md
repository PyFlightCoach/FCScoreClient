# Flight Coach Score Client

docker build -t fcs_client --build-arg SOURCE_COMMIT=$SOURCE_COMMIT .

docker run --rm -p 5173:5173 --name=fcs_client fcs_client
