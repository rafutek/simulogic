import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Circuit } from './circuit.entity';
import { Entity } from '@simulogic/core';
import * as fs from 'fs';

const example_files_path = "./examples/";

// Note: The database must be deployed to run those tests


describe('Circuits end-to-end tests', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    // Removes all circuits from database before and after each test.
    beforeEach(async () => {
        await deleteAllCircuits();
    });
    afterEach(async () => {
        await deleteAllCircuits();
    });

    afterAll(async () => {
        await app.close();
    });

    /**
     * Deletes all circuit files listed in database and their respective files.
     * GET and DELETE requests must work.
     */
    const deleteAllCircuits = async () => {
        const uncleared = await request(app.getHttpServer()).get('/circuits');
        const circuits_to_delete: Circuit[] = uncleared.body;
        await Promise.all(
            circuits_to_delete.map(circ => deleteCircuit(circ))
        );
    }

    /**
     * Deletes circuit database entry and relative existing files.
     * DELETE request must work.
     * @param circuit circuit to delete
     */
    const deleteCircuit = (circuit: Circuit) => {
        if(fs.existsSync(circuit.path)) fs.unlinkSync(circuit.path);
        if(fs.existsSync(circuit.simulator_path)) fs.unlinkSync(circuit.simulator_path);
        return request(app.getHttpServer()).delete(`/circuits/${circuit.uuid}`);
    }

    /**
     * Uploads some files.
     */
    const uploadValidFiles = async () => {
        await request(app.getHttpServer())
            .post('/circuits')
            .attach("file", example_files_path + "adder.logic")
            .attach("file", example_files_path + "OR.logic");
        await request(app.getHttpServer())
            .post('/circuits')
            .attach("file", example_files_path + "triSeq.logic");
    }

    /**
     * Gets and returns first circuit file.
     */
    const getFirstFile = async (): Promise<Entity> => {
        return await (await request(app.getHttpServer()).get('/circuits')).body[0];
    }



    describe("POST /circuits", () => {
        it("should succeed", async () => {
            // When posting a valid circuit file
            const response = await request(app.getHttpServer())
                .post('/circuits')
                .attach("file", example_files_path + "OR.logic")

            // Then response should be empty and ok
            expect(response.body).toEqual([]);
            expect(response.ok).toBeTruthy();
        });

        it("should fail", async () => {
            // When posting an invalid circuit file
            const response = await request(app.getHttpServer())
                .post('/circuits')
                .attach("file", example_files_path + "OR.simu")

            // Then response should contain the invalid file and still be ok
            expect(response.body.length).toEqual(1);
            expect(response.body[0].originalname).toEqual("OR.simu");
            expect(response.ok).toBeTruthy();
        });

        it("should partially fail", async () => {
            // When posting valid and invalid circuit files
            const response = await request(app.getHttpServer())
                .post('/circuits')
                .attach("file", example_files_path + "adder.logic")
                .attach("file", example_files_path + "OR.logic")
                .attach("file", example_files_path + "OR.simu");

            // Then response should contain only the invalid file and be ok
            expect(response.body.length).toEqual(1);
            expect(response.body[0].originalname).toEqual("OR.simu");
            expect(response.ok).toBeTruthy();
        });
    });

    describe("GET /circuits", () => {

        it("should return no circuits", async () => {
            // When getting circuits
            const response = await request(app.getHttpServer()).get('/circuits');

            // Then response should contain an empty array and be ok
            expect(response.body).toEqual([]);
            expect(response.ok).toBeTruthy();
        });

        it("should return all uploaded circuits", async () => {
            // Given uploaded circuits
            await uploadValidFiles();

            // When getting circuits
            const response = await request(app.getHttpServer()).get('/circuits');

            // Then response should contain the uploaded circuits and be ok
            expect(response.body.length).toEqual(3);
            expect(response.body[0].name).toEqual("adder.logic");
            expect(response.body[1].name).toEqual("OR.logic");
            expect(response.body[2].name).toEqual("triSeq.logic");
            expect(response.ok).toBeTruthy();
        });

    });

    describe("GET /circuits/'uuid'", () => {
        it("should fail to get one circuit", async () => {
            // When getting an absent circuit
            const response = await request(app.getHttpServer()).get(`/circuits/a bad uuid`);

            // Then request should fail
            expect(response.ok).toBeFalsy();
        });

        it("should get one circuit", async () => {
            // Given an uploaded circuit file
            await uploadValidFiles();
            const circuit = await getFirstFile();

            // When getting the circuit
            const response = await request(app.getHttpServer()).get(`/circuits/${circuit.uuid}`);

            // Then response should contain the circuit and be ok
            expect(response.body.name).toEqual("adder.logic");
            expect(response.ok).toBeTruthy();
        });
    });

    describe("DELETE /circuits", () => {
        it("should fail", async () => {
            // When deleting /circuits
            const response = await request(app.getHttpServer()).delete('/circuits');

            // Then request should fail
            expect(response.ok).toBeFalsy();
        });

        it("should fail", async () => {
            // When deleting an absent circuit
            const response = await request(app.getHttpServer()).delete('/circuits/a bad uuid');

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should delete one circuit", async () => {
            // Given an uploaded circuit file
            await uploadValidFiles();
            const circuit = await getFirstFile();

            // When deleting the circuit
            const response = await request(app.getHttpServer()).delete(`/circuits/${circuit.uuid}`);

            // Then request should succeed
            expect(response.ok).toBeTruthy();
            const left_circuit = await getFirstFile();
            expect(left_circuit.uuid).not.toEqual(circuit.uuid);
        });
    });

    describe("GET /circuits/search/'exp'", () => {
        it("should fail when there are no files", async () => {
            // When searching through an empty database
            const response = await request(app.getHttpServer()).get("/circuits/search/tri");

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should fail when no filename contains expression", async () => {
            // Given an uploaded circuit file
            await uploadValidFiles();

            // When searching an absent expression
            const response = await request(app.getHttpServer()).get("/circuits/search/blablabla");

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should return found circuit", async () => {
            // Given an uploaded circuit file
            await uploadValidFiles();

            // When searching a present expression
            const response = await request(app.getHttpServer()).get("/circuits/search/tri");

            // Then response should be ok 
            // and contain the file which name contains 'tri'
            expect(response.ok).toBeTruthy();
            expect(response.body.length).toEqual(1);
            expect(response.body[0].name).toEqual("triSeq.logic");
        });
    });

})