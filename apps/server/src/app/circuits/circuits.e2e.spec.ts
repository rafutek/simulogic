import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Circuit } from './circuit.entity';
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
        await clearTableAndFiles(app, "circuit");
    });
    afterEach(async () => {
        await clearTableAndFiles(app, "circuit");
    });

    afterAll(async () => {
        await app.close();
    });


    describe("POST /circuits", () => {
        it("should succeed", async () => {
            // When posting a valid circuit file
            const response = await request(app.getHttpServer())
                .post('/circuits')
                .attach("file", example_files_path + circuit_filenames[0])

            // Then response should be empty and ok
            expect(response.body).toEqual([]);
            expect(response.ok).toBeTruthy();
        });

        it("should fail", async () => {
            // When posting an invalid circuit file
            const response = await request(app.getHttpServer())
                .post('/circuits')
                .attach("file", example_files_path + simu_filenames[0])

            // Then response should contain the invalid file and still be ok
            expect(response.body.length).toEqual(1);
            expect(response.body[0].originalname).toEqual(simu_filenames[0]);
            expect(response.ok).toBeTruthy();
        });

        it("should partially fail", async () => {
            // When posting valid and invalid circuit files
            const response = await request(app.getHttpServer())
                .post('/circuits')
                .attach("file", example_files_path + circuit_filenames[0])
                .attach("file", example_files_path + circuit_filenames[1])
                .attach("file", example_files_path + simu_filenames[0]);

            // Then response should contain only the invalid file and be ok
            expect(response.body.length).toEqual(1);
            expect(response.body[0].originalname).toEqual(simu_filenames[0]);
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
            await uploadFilesTo(app, circuit_filenames, "circuit");

            // When getting circuits
            const response = await request(app.getHttpServer()).get('/circuits');
            const uploaded_circuits: Circuit[] = response.body;

            // Then response should contain the uploaded circuits and be ok
            expect(uploaded_circuits.length).toEqual(circuit_filenames.length);
            uploaded_circuits.forEach(uploaded_circuit => {
                const present = circuit_filenames.includes(uploaded_circuit.name);
                expect(present).toBeTruthy();
            })
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
            await uploadFilesTo(app, circuit_filenames, "circuit");
            const circuit = await getFirstFile(app, "circuit");

            // When getting the circuit
            const response = await request(app.getHttpServer()).get(`/circuits/${circuit.uuid}`);

            // Then response should contain the circuit and be ok
            expect(response.body).toEqual(circuit);
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
            await uploadFilesTo(app, circuit_filenames, "circuit");
            const circuit = await getFirstFile(app, "circuit");

            // When deleting the circuit
            const response = await request(app.getHttpServer()).delete(`/circuits/${circuit.uuid}`);

            // Then request should succeed
            expect(response.ok).toBeTruthy();
            const left_circuit = await getFirstFile(app, "circuit");
            expect(left_circuit.uuid).not.toEqual(circuit.uuid);
        });
    });

    describe("GET /circuits/search/'exp'", () => {
        it("should fail when there are no files", async () => {
            // When searching through an empty database
            const response = await request(app.getHttpServer()).get("/circuits/search/blabla");

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should fail when no filename contains expression", async () => {
            // Given an uploaded circuit file
            await uploadFilesTo(app, circuit_filenames, "circuit");

            // When searching an absent expression
            const response = await request(app.getHttpServer()).get("/circuits/search/blablabla");

            // Then request should fail and give a message
            expect(response.ok).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });

        it("should return found circuit", async () => {
            // Given some uploaded circuit files
            // and an expression present in a filename
            await uploadFilesTo(app, circuit_filenames, "circuit");
            const expression = circuit_filenames[0].slice(1, 5);

            // When searching the expression
            const response = await request(app.getHttpServer()).get(`/circuits/search/${expression}`);

            // Then response should be ok 
            // and contain the file which name contains expression
            expect(response.ok).toBeTruthy();
            expect(response.body.length).toEqual(1);
            expect(response.body[0].name).toEqual(circuit_filenames[0]);
        });
    });

})