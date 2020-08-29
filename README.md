# Simulogic

This university project is a web interface allowing the simulation and visualization of logic circuits.

## Dependencies

- GNU/Linux

The simulator needs this operating system to work.

- Java and ANTLR lib

The first simulator part needs a Java environment with ANTLR library.
You must build the Java circuit creator to use the simulator, see README in *simulator/* for details.

- make and C++ compiler

The second simulator part needs make and g++.

- Docker

The MySQL database used to store circuit and simulation files informations is deployed with docker-compose.

- Yarn 

It uses a series of packages listed in *package.json*. I use yarn to manage them, but you can use npm if you want.
Run `yarn` to install the packages.

The main packages are: Nx for the project management, Nest for the server app, and React for the interface app.

Some scripts are also defined in *package.json*, run `yarn script-name [optional-arguments]` to execute one of them.

## Development

Run `docker-compose up` to deploy the database on port 3036.

Run `yarn nx serve server` to deplou the server app on port 8080.

Run `yarn nx serve interface` to deploy the interface app on port 4200. Visit http://localhost:4200/ in your browser.

To see the several components of the interface, run `yarn nx run ui:storybook` to launch storybook on port 4400. Visit http://localhost:4400/ in your browser.

Note: The apps will automatically reload if you change any of the source files.

## Production (not finished)

To deploy the project in a production environment, Dockerfiles are used to create environment, server and interface production images.
They are used in *docker-compose.prod.yml* but Traefik service still needs to be configured.

## Running tests

Run `yarn nx test server` to execute the unit tests of the server app via Jest.
