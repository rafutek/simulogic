import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import {
    simu_files_wavedrom,
    simu_files_intervals,
    uploadFileTo,
    clearTableAndFiles,
    simu_rslt_files_wavedrom,
    getFirstFile,
    simu_filenames
} from '@simulogic/test';
import { SimulatorDTO } from './simulator.dto';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { Interval } from '@simulogic/core';

// Note: The database must be deployed to run those tests

describe('Simulator end-to-end tests', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe()); // for DTO validations
        await app.init();
    });

    // Removes all simulations from database before and after each test.
    beforeEach(async () => {
        await clearTableAndFiles(app, "simulation");
        await clearTableAndFiles(app, "circuit");
    });
    afterEach(async () => {
        await clearTableAndFiles(app, "simulation");
        await clearTableAndFiles(app, "circuit");
    });

    afterAll(async () => {
        await app.close();
    });

    describe("POST /simulator", () => {
        let simulatorDTO: SimulatorDTO;

        beforeEach(() => {
            simulatorDTO = { uuid_simu: "" };
        })

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
                const { filename, wavedrom } = simu_file;
                await uploadFileTo(app, filename, "simulation");
                const simu_entity: SimulationFile = await getFirstFile(app, "simulation");

                // When posting a simulatorDTO with uuid_simu
                simulatorDTO.uuid_simu = simu_entity.uuid;
                const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

                // Then response should be OK and contain the expected WaveDrom
                expect(response.ok).toBeTruthy();
                expect(response.body).toEqual(wavedrom);
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
                const { circuit_filename, combined_wavedrom, simu_file_wavedrom } = simu_rslt_file;
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
                expect(response.body).toEqual(combined_wavedrom);
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
                const { filename, interval, wavedrom } = simu_file_interval;
                await uploadFileTo(app, filename, "simulation");
                const simu_entity: SimulationFile = await getFirstFile(app, "simulation");

                // When posting a simulatorDTO with uuid_simu and interval
                simulatorDTO.uuid_simu = simu_entity.uuid;
                simulatorDTO.interval = interval;
                const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

                // Then response should be OK and contain wanted simulation interval
                expect(response.ok).toBeTruthy();
                expect(response.body).toEqual(wavedrom);
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
    });

});