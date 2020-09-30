import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import {
    simu_files_wavedrom,
    uploadFilesTo,
    clearTableAndFiles,
    getFiles
} from '@simulogic/test';
import { SimulatorDTO } from './simulator.dto';
import { Simulation } from '../simulations/simulation.entity';

// Note: The database must be deployed to run those tests

describe('Simulator end-to-end tests', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
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

    describe("process", () => {
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

        it("should return expected WaveDroms", async () => {
            // Given uploaded simulation files
            const simu_filenames = simu_files_wavedrom.map(element => element.filename);
            await uploadFilesTo(app, simu_filenames, "simulation");
            const uploaded_simulations = await getFiles(app, "simulation");

            for (let i = 0; i < uploaded_simulations.length; i++) {

                // When posting to the simulator simulatorDTO with uuid_simu of a file
                const simu: Simulation = uploaded_simulations[i];
                simulatorDTO.uuid_simu = simu.uuid;
                const response = await request(app.getHttpServer()).post('/simulator').send(simulatorDTO);

                // Then response should be ok and returned WaveDrom equal to expected one
                const simu_file_wavedrom = simu_files_wavedrom.find(element => element.filename == simu.name);
                expect(response.ok).toBeTruthy();
                expect(response.body).toEqual(simu_file_wavedrom.wavedrom);
            }
        });

    });

});