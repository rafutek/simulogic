import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Simulation } from './simulation.entity';
import { Entity } from '@simulogic/core';
import * as fs from 'fs';
import {
    example_files_path,
    circuit_filenames,
    simu_filenames,
    uploadFilesTo,
    clearTableAndFiles,
    getFirstFile
} from '@simulogic/test';

// Note: The database must be deployed to run those tests


describe('Simulations end-to-end tests', () => {
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
    });
    afterEach(async () => {
        await clearTableAndFiles(app, "simulation");
    });

    afterAll(async () => {
        await app.close();
    });


    describe("POST /simulations", () => {
        it("should succeed", async () => {
            // When posting a valid simulation file
            const response = await request(app.getHttpServer())
                .post('/simulations')
                .attach("file", example_files_path + simu_filenames[0]);

            // Then response should be empty and ok
            expect(response.body).toEqual([]);
            expect(response.ok).toBeTruthy();
        });

        it("should fail", async () => {
            // When posting an invalid simulation file
            const response = await request(app.getHttpServer())
                .post('/simulations')
                .attach("file", example_files_path + circuit_filenames[0]);

            // Then response should contain the invalid file and still be ok
            expect(response.body.length).toEqual(1);
            expect(response.body[0].originalname).toEqual(circuit_filenames[0]);
            expect(response.ok).toBeTruthy();
        });

        it("should partially fail", async () => {
            // When posting valid and invalid simulation files
            const response = await request(app.getHttpServer())
                .post('/simulations')
                .attach("file", example_files_path + simu_filenames[0])
                .attach("file", example_files_path + simu_filenames[1])
                .attach("file", example_files_path + circuit_filenames[0]);

            // Then response should contain only the invalid file and be ok
            expect(response.body.length).toEqual(1);
            expect(response.body[0].originalname).toEqual(circuit_filenames[0]);
            expect(response.ok).toBeTruthy();
        });
    });

    describe("GET /simulations", () => {

        it("should return no simulations", async () => {
            // When getting simulations
            const response = await request(app.getHttpServer()).get('/simulations');

            // Then response should contain an empty array and be ok
            expect(response.body).toEqual([]);
            expect(response.ok).toBeTruthy();
        });

        it("should return all uploaded simulations", async () => {
            // Given uploaded simulations
            await uploadFilesTo(app, simu_filenames, "simulation");

            // When getting simulations
            const response = await request(app.getHttpServer()).get('/simulations');
            const uploaded_simulations: Simulation[] = response.body;

            // Then response should contain the uploaded circuits and be ok
            expect(uploaded_simulations.length).toEqual(simu_filenames.length);
            uploaded_simulations.forEach(uploaded_simu => {
                const present = simu_filenames.includes(uploaded_simu.name);
                expect(present).toBeTruthy();
            })
            expect(response.ok).toBeTruthy();
        });

    });

    describe("GET /simulations/'uuid'", () => {
        it("should fail to get one simulation", async () => {
            // When getting an absent simulation
            const response = await request(app.getHttpServer()).get(`/simulations/a bad uuid`);

            // Then request should fail
            expect(response.ok).toBeFalsy();
        });

        it("should get one simulation", async () => {
            // Given an uploaded simulation file
            await uploadFilesTo(app, simu_filenames, "simulation");
            const simulation = await getFirstFile(app, "simulation");

            // When getting the simulation
            const response = await request(app.getHttpServer()).get(`/simulations/${simulation.uuid}`);

            // Then response should contain the simulation and be ok
            expect(response.body.name).toEqual(simulation.name);
            expect(response.ok).toBeTruthy();
        });
    });

    describe("DELETE /simulations", () => {
        it("should fail", async () => {
            // When deleting /simulations
            const response = await request(app.getHttpServer()).delete('/simulations');

            // Then request should fail
            expect(response.ok).toBeFalsy();
        });

        it("should fail", async () => {
            // When deleting an absent simulation
            const response = await request(app.getHttpServer()).delete('/simulations/a bad uuid');

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should delete one simulation", async () => {
            // Given an uploaded simulation file
            await uploadFilesTo(app, simu_filenames, "simulation");
            const simulation = await getFirstFile(app, "simulation");

            // When deleting the simulation
            const response = await request(app.getHttpServer()).delete(`/simulations/${simulation.uuid}`);

            // Then request should succeed
            expect(response.ok).toBeTruthy();
            const left_simulation = await getFirstFile(app, "simulation");
            expect(left_simulation.uuid).not.toEqual(simulation.uuid);
        });
    });

    describe("GET /simulations/search/'exp'", () => {
        it("should fail when there are no files", async () => {
            // When searching through an empty database
            const response = await request(app.getHttpServer()).get("/simulations/search/blabla");

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should fail when no filename contains expression", async () => {
            // Given an uploaded simulation file
            await uploadFilesTo(app, simu_filenames, "simulation");

            // When searching an absent expression
            const response = await request(app.getHttpServer()).get("/simulations/search/blablabla");

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should return found simulation", async () => {
            // Given some uploaded simulation files
            // and an expression present in a filename
            await uploadFilesTo(app, simu_filenames, "simulation");
            const expression = simu_filenames[0].slice(1, 5);

            // When searching the expression
            const response = await request(app.getHttpServer()).get(`/simulations/search/${expression}`);

            // Then response should be ok 
            // and contain the file which name contains expression
            expect(response.ok).toBeTruthy();
            expect(response.body.length).toEqual(1);
            expect(response.body[0].name).toEqual(simu_filenames[0]);
        });
    });

})