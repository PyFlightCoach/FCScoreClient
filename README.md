# Flight Coach Score Client

docker build -t fcs_client .

docker run --rm -p 5173:5173 --name=fcs_client fcs_client
