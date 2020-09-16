import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Simulation } from './simulation.entity';
import { Entity } from '@simulogic/core';
import * as fs from 'fs';

const example_files_path = "./examples/";

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
        await deleteAllSimulations();
    });
    afterEach(async () => {
        await deleteAllSimulations();
    });

    afterAll(async () => {
        await app.close();
    });

    /**
     * Deletes all simulation files listed in database and their respective files.
     * GET and DELETE requests must work.
     */
    const deleteAllSimulations = async () => {
        const uncleared = await request(app.getHttpServer()).get('/simulations');
        const simulations_to_delete: Simulation[] = uncleared.body;
        await Promise.all(
            simulations_to_delete.map(circ => deleteSimulation(circ))
        );
    }

    /**
     * Deletes simulation database entry and relative existing files.
     * DELETE request must work.
     * @param simulation simulation to delete
     */
    const deleteSimulation = (simulation: Simulation) => {
        if(fs.existsSync(simulation.path)) fs.unlinkSync(simulation.path);
        if(fs.existsSync(simulation.result_path)) fs.unlinkSync(simulation.result_path);
        return request(app.getHttpServer()).delete(`/simulations/${simulation.uuid}`);
    }

    /**
     * Uploads some files.
     */
    const uploadValidFiles = async () => {
        await request(app.getHttpServer())
            .post('/simulations')
            .attach("file", example_files_path + "adder.simu")
            .attach("file", example_files_path + "OR.simu");
        await request(app.getHttpServer())
            .post('/simulations')
            .attach("file", example_files_path + "triSeq.simu");
    }

    /**
     * Gets and returns first simulation file.
     */
    const getFirstFile = async (): Promise<Entity> => {
        return await (await request(app.getHttpServer()).get('/simulations')).body[0];
    }



    describe("POST /simulations", () => {
        it("should succeed", async () => {
            // When posting a valid simulation file
            const response = await request(app.getHttpServer())
                .post('/simulations')
                .attach("file", example_files_path + "OR.simu")

            // Then response should be empty and ok
            expect(response.body).toEqual([]);
            expect(response.ok).toBeTruthy();
        });

        it("should fail", async () => {
            // When posting an invalid simulation file
            const response = await request(app.getHttpServer())
                .post('/simulations')
                .attach("file", example_files_path + "OR.logic")

            // Then response should contain the invalid file and still be ok
            expect(response.body.length).toEqual(1);
            expect(response.body[0].originalname).toEqual("OR.logic");
            expect(response.ok).toBeTruthy();
        });

        it("should partially fail", async () => {
            // When posting valid and invalid simulation files
            const response = await request(app.getHttpServer())
                .post('/simulations')
                .attach("file", example_files_path + "adder.simu")
                .attach("file", example_files_path + "OR.simu")
                .attach("file", example_files_path + "OR.logic");

            // Then response should contain only the invalid file and be ok
            expect(response.body.length).toEqual(1);
            expect(response.body[0].originalname).toEqual("OR.logic");
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
            await uploadValidFiles();

            // When getting simulations
            const response = await request(app.getHttpServer()).get('/simulations');

            // Then response should contain the uploaded simulations and be ok
            expect(response.body.length).toEqual(3);
            expect(response.body[0].name).toEqual("adder.simu");
            expect(response.body[1].name).toEqual("OR.simu");
            expect(response.body[2].name).toEqual("triSeq.simu");
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
            await uploadValidFiles();
            const simulation = await getFirstFile();

            // When getting the simulation
            const response = await request(app.getHttpServer()).get(`/simulations/${simulation.uuid}`);

            // Then response should contain the simulation and be ok
            expect(response.body.name).toEqual("adder.simu");
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
            await uploadValidFiles();
            const simulation = await getFirstFile();

            // When deleting the simulation
            const response = await request(app.getHttpServer()).delete(`/simulations/${simulation.uuid}`);

            // Then request should succeed
            expect(response.ok).toBeTruthy();
            const left_simulation = await getFirstFile();
            expect(left_simulation.uuid).not.toEqual(simulation.uuid);
        });
    });

    describe("GET /simulations/search/'exp'", () => {
        it("should fail when there are no files", async () => {
            // When searching through an empty database
            const response = await request(app.getHttpServer()).get("/simulations/search/tri");

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should fail when no filename contains expression", async () => {
            // Given an uploaded simulation file
            await uploadValidFiles();

            // When searching an absent expression
            const response = await request(app.getHttpServer()).get("/simulations/search/blablabla");

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should return found simulation", async () => {
            // Given an uploaded simulation file
            await uploadValidFiles();

            // When searching a present expression
            const response = await request(app.getHttpServer()).get("/simulations/search/tri");

            // Then response should be ok 
            // and contain the file which name contains 'tri'
            expect(response.ok).toBeTruthy();
            expect(response.body.length).toEqual(1);
            expect(response.body[0].name).toEqual("triSeq.simu");
        });
    });

})