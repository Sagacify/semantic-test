# semantic-test

## How to run

To run the application use the command:

```sh
docker-compose up
```

### How to test

To run all the tests use the command:

```sh
docker-compose run node npm test
```

*The test command runs the lint command first and coverage at the end*

To run unit tests only use the command:

```sh
docker-compose run node npm test:spec
```

To run lint tests only use the command:

```sh
docker-compose run node npm test:lint
```

To run coverage only use the command:

```sh
docker-compose run node npm test:cover
```

### API

#### openapi specs

On the `/specs` route, you'll get the full openapi json document.
You can use it with **postman** to generate a new api and then create the corresponding collection of requests.
If you specify the query param `?documentation=true`, then you won't have the route tagged with `x-saga-no-doc` in the opoenapi document.

#### Api docs

On the `/api-docs` route, you'll get the documentation base on the openapi document without the routes tagged with `x-saga-no-doc`.
