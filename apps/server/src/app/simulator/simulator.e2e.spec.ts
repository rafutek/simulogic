import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import {
    simu_files_wavedrom,
    simu_files_intervals,
    simu_files_wires,
    uploadFileTo,
    clearTableAndFiles,
    simu_rslt_files_wavedrom,
    getFirstFile,
    simu_filenames,
    adder_signals_names
} from '@simulogic/test';
import { SimulatorDTO } from './simulator.dto';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { Interval } from '@simulogic/core';

// Note: The database must be deployed to run those tests

describe('Simulator end-to-end tests', () => {
    let app: INestApplication;
    let simulatorDTO: SimulatorDTO;

    const startApp = async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe()); // for DTO validations
        await app.init();
    }

    const stopApp = async () => {
        await app.close();
    }
    const clearApp = async () => {
        await clearTableAndFiles(app, "simulation");
        await clearTableAndFiles(app, "circuit");
    }
    const clearAndStopApp = async () => {
        await clearApp();
        await stopApp();
    }
    // Sets an empty simulatorDTO variable before each test.
    beforeEach(() => {
        simulatorDTO = { uuid_simu: "" };
    });

    describe("POST simulatorDTO to /simulator", () => {

        // Starts the app before all these tests, and stops it after.
        // Removes all simulations from database before and after each test.
        beforeAll(startApp);
        beforeEach(clearApp);
        afterEach(clearApp);
        afterAll(stopApp);

        it("should fail when simulatorDTO is undefined", async () => {
            // Given an undefined simulatorDTO
            simulatorDTO = undefined;
            // When posting it to the simulator
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then it should return an error
            expect(response.ok).toBeFalsy();
        });

        it("should fail when simulatorDTO uuid_simu is undefined", async () => {
            // Given a simulatorDTO with uuid_simu undefined
            simulatorDTO.uuid_simu = undefined;

            // When posting it to the simulator
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then it should return an error
            expect(response.ok).toBeFalsy();
        });

        it("should fail when wanted simulation is not found", async () => {
            // Given a uuid_simu corresponding to nothing
            simulatorDTO.uuid_simu = "bad uuid";

            // When posting it to the simulator
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then it should return an error
            expect(response.ok).toBeFalsy();
        });

        test.each(simu_files_wavedrom)
            ("should return expected WaveDrom (%#)", async (simu_file) => {
                // Given uploaded simulation file
                const { filename, expected_wavedrom } = simu_file;
                await uploadFileTo(app, filename, "simulation");
                const simu_entity: SimulationFile = await getFirstFile(app, "simulation");

                // When posting a simulatorDTO with uuid_simu
                simulatorDTO.uuid_simu = simu_entity.uuid;
                const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

                // Then response should be OK and contain the expected WaveDrom
                expect(response.ok).toBeTruthy();
                expect(response.body).toEqual(expected_wavedrom);
            });

        it("should fail to return expected combined WaveDrom when no circuit uuid", async () => {
            // Given uploaded simulation file
            await uploadFileTo(app, simu_filenames[0], "simulation");
            const simu_entity: SimulationFile = await getFirstFile(app, "simulation");

            // When posting a simulatorDTO with uuid_simu and result
            simulatorDTO.uuid_simu = simu_entity.uuid;
            simulatorDTO.result = true;
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then response should not be OK (circuit uuid expected)
            expect(response.ok).toBeFalsy();
        });

        test.each(simu_rslt_files_wavedrom)
            ("should return expected combined WaveDrom (%#)", async (simu_rslt_file) => {
                // Given uploaded simulation and circuit files
                const { circuit_filename, expected_combined_wavedrom, simu_file_wavedrom } = simu_rslt_file;
                await uploadFileTo(app, circuit_filename, "circuit");
                await uploadFileTo(app, simu_file_wavedrom.filename, "simulation");
                const circuit_entity: CircuitFile = await getFirstFile(app, "circuit");
                const simu_entity: SimulationFile = await getFirstFile(app, "simulation");

                // When posting a simulatorDTO with uuid_simu, uuid_circuit and result
                simulatorDTO.uuid_simu = simu_entity.uuid;
                simulatorDTO.uuid_circuit = circuit_entity.uuid;
                simulatorDTO.result = true;
                const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

                // Then response should be OK and contain the expected combined WaveDrom
                // (simulation input and output in a single variable)
                expect(response.ok).toBeTruthy();
                expect(response.body).toEqual(expected_combined_wavedrom);
            });

        it("should fail to return expected WaveDrom interval when bad interval", async () => {
            // Given uploaded simulation file and an interval with start greater than end
            await uploadFileTo(app, simu_filenames[0], "simulation");
            const simu_entity: SimulationFile = await getFirstFile(app, "simulation");
            const interval: Interval = { start: 100, end: 10 };

            // When posting a simulatorDTO with uuid_simu and interval
            simulatorDTO.uuid_simu = simu_entity.uuid;
            simulatorDTO.interval = interval;
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then response should not be OK (bad interval)
            expect(response.ok).toBeFalsy();
        });

        it("should not fail when interval start is defined and interval end is undefined", async () => {
            // Given uploaded simulation file and an interval with start greater than end
            await uploadFileTo(app, simu_filenames[0], "simulation");
            const simu_entity: SimulationFile = await getFirstFile(app, "simulation");
            const interval: Interval = { start: 100, end: undefined };

            // When posting a simulatorDTO with uuid_simu and interval
            simulatorDTO.uuid_simu = simu_entity.uuid;
            simulatorDTO.interval = interval;
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then response should be OK
            expect(response.ok).toBeTruthy()
        });

        it("should not fail when interval start is undefined and interval end is defined", async () => {
            // Given uploaded simulation file and an interval with start greater than end
            await uploadFileTo(app, simu_filenames[0], "simulation");
            const simu_entity: SimulationFile = await getFirstFile(app, "simulation");
            const interval: Interval = { start: undefined, end: 100 };

            // When posting a simulatorDTO with uuid_simu and interval
            simulatorDTO.uuid_simu = simu_entity.uuid;
            simulatorDTO.interval = interval;
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then response should be OK
            expect(response.ok).toBeTruthy()
        });

        test.each(simu_files_intervals)
            ("should return expected WaveDrom interval (%#)", async (simu_file_interval) => {
                // Given uploaded simulation file and an interval
                const { filename, interval, expected_wavedrom } = simu_file_interval;
                await uploadFileTo(app, filename, "simulation");
                const simu_entity: SimulationFile = await getFirstFile(app, "simulation");

                // When posting a simulatorDTO with uuid_simu and interval
                simulatorDTO.uuid_simu = simu_entity.uuid;
                simulatorDTO.interval = interval;
                const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

                // Then response should be OK and contain wanted simulation interval
                expect(response.ok).toBeTruthy();
                expect(response.body).toEqual(expected_wavedrom);
            });

        it("should not fail to request simulation result interval", async () => {
            // Given uploaded circuit and simulation files and an interval
            const { circuit_filename, simu_file_wavedrom } = simu_rslt_files_wavedrom[0];
            await uploadFileTo(app, circuit_filename, "circuit");
            await uploadFileTo(app, simu_file_wavedrom.filename, "simulation");
            const circuit_entity: CircuitFile = await getFirstFile(app, "circuit");
            const simu_entity: SimulationFile = await getFirstFile(app, "simulation");
            const interval: Interval = { start: 10, end: 100 };

            // When posting a simulatorDTO with uuid_simu, uuid_circuit, result and interval
            simulatorDTO.uuid_simu = simu_entity.uuid;
            simulatorDTO.uuid_circuit = circuit_entity.uuid;
            simulatorDTO.result = true;
            simulatorDTO.interval = interval;
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then response should be OK
            expect(response.ok).toBeTruthy()
        });

        test.each(simu_files_wires)
            ("should return expected WaveDrom with selected wires (%#)", async (simu_file_wire) => {
                // Given uploaded simulation file and an interval
                const { simu_filename, selected_wires, expected_wavedrom } = simu_file_wire;
                await uploadFileTo(app, simu_filename, "simulation");
                const simu_entity: SimulationFile = await getFirstFile(app, "simulation");

                // When posting a simulatorDTO with uuid_simu and wires array
                simulatorDTO.uuid_simu = simu_entity.uuid;
                simulatorDTO.wires = selected_wires;
                const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

                // Then response should be OK and contain simulation with wanted wires
                expect(response.ok).toBeTruthy();
                expect(response.body).toEqual(expected_wavedrom);
            });

        it("should not fail to request simulation result wires", async () => {
            // Given uploaded circuit and simulation files and an interval
            const { circuit_filename, simu_file_wavedrom } = simu_rslt_files_wavedrom[0];
            await uploadFileTo(app, circuit_filename, "circuit");
            await uploadFileTo(app, simu_file_wavedrom.filename, "simulation");
            const circuit_entity: CircuitFile = await getFirstFile(app, "circuit");
            const simu_entity: SimulationFile = await getFirstFile(app, "simulation");
            const selected_wires = simu_files_wires[0].selected_wires;

            // When posting a simulatorDTO with uuid_simu, uuid_circuit, result and interval
            simulatorDTO.uuid_simu = simu_entity.uuid;
            simulatorDTO.uuid_circuit = circuit_entity.uuid;
            simulatorDTO.result = true;
            simulatorDTO.wires = selected_wires;
            const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // Then response should be OK
            expect(response.ok).toBeTruthy()
        });
    });

    describe("GET /simulator/sentsignals", () => {

        // Restarts a clean app before each test.
        beforeEach(startApp);
        afterEach(clearAndStopApp);

        it("should return nothing when no previously sent WaveDrom", async () => {
            // Given a fresh app
            // When getting sent signals
            const response = await request(app.getHttpServer()).get("/simulator/sentsignals");

            // Then it should be ok and get nothing
            expect(response.ok).toBeTruthy();
            expect(response.body).toEqual({});
        });

        it("should return input group signals of previously sent WaveDrom", async () => {
            // Given a simulation file uploaded and a request to get its parsed variable
            await uploadFileTo(app, adder_signals_names.simu_filename, "simulation");
            const simu_entity: SimulationFile = await getFirstFile(app, "simulation");
            simulatorDTO.uuid_simu = simu_entity.uuid;
            await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

            // When getting sent signals
            const response = await request(app.getHttpServer()).get("/simulator/sentsignals");

            // Then it should be ok and get nothing
            expect(response.ok).toBeTruthy();
            expect(response.body).toEqual([adder_signals_names.signals_names_group]);
        });


        // TODO:
        // test quand wavedrom envoyé a input et output
        // test quand wavedrom envoyé puis un autre
    });
});