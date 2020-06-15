# Simulogic

This project was generated and managed using [Nx](https://nx.dev).

The finality is a web interface allowing the simulation and visualization of logic circuits.

## Dependencies

This is a NodeJS projet, so it uses node packages listed in *package.json*. I use yarn as node package manager, but you can use npm if you want.
Run `yarn` to install them, `yarn script-name` to run a script.

Install nx globally with `yarn global add @nrwl/cli`.

You also need to [install docker-compose](https://docs.docker.com/compose/install/) if not already done.

You must build the java circuit creator to use the simulator, see README in `./simulator` for details.

## Development

Run `docker-compose up` to create a mysql docker container (used by the server).

Run `nx serve server` to generate the server app on http://localhost:3333/.

Run `nx serve interface` to generate the interface app on http://localhost:4200/.

Run `nx run ui:storybook` to launch ui storybook on http://localhost:4400/.

The apps will automatically reload if you change any of the source files.

## Build

Run `nx build app` to build a project (interface or server). The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test interface` to execute the unit tests of the interface app via [Jest](https://jestjs.io). You can also run `nx test server` and `nx test ui`.

Run `nx affected:test` to execute the unit tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.