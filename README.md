# Simulogic

A web app and a server app to simulate logic circuits and visualize wanted signals.

To do a simulation, you must upload (to the server via the web interface) a circuit file descriptor, and an input file descriptor. These files have respectively *.logic* and *.simu* extensions, and some examples can be found in **examples/** directory.

## Dependencies

- GNU/Linux

The simulator needs this operating system to work.

- Java and ANTLR lib

The first simulator part needs a Java environment with ANTLR library.
You must build the Java circuit creator to use the simulator, see README in **simulator/** for details.

- make and C++ compiler

The second simulator part needs make and g++.

- Docker

The MySQL database used to store circuit and simulation files informations is deployed with docker-compose.

- Yarn (or npm)

It uses a series of packages listed in *package.json*.
Run `yarn` to install the packages.

The main packages are: Nx for the project management, Nest for the server app, and React for the interface app.

Some scripts are also defined in *package.json*, run `yarn script-name [optional-arguments]` to execute one of them.

## Development

Run `docker-compose up` to deploy the database on port 3036.

Run `yarn nx serve server` to deploy the server app on port 8080.

Run `yarn nx serve interface` to deploy the interface app on port 4200. Visit http://localhost:4200/ in your browser.

To see the several components of the interface, run `yarn nx run ui:storybook` to launch storybook on port 4400. Visit http://localhost:4400/ in your browser.

Note: The apps will automatically reload if you change any of the source files.

## Production (not finished)

To deploy the project in a production environment, Dockerfiles are used to create environment, server and interface production images.
They are used in *docker-compose.prod.yml* but Traefik service still needs to be configured.

## Tests

Run `yarn nx test server` to execute the unit and end-to-end tests of server app via Jest.

If some errors are thrown, it might be because of parallel execution. So consider using `yarn nx test server --runInBand` to execute one test after another.

## Documentation

Run `yarn doc:server` to generate and deploy server documentation. You will be able to see dependency graphs and read comments of server app on your browser.