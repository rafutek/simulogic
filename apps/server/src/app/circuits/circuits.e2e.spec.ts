import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Circuit } from './circuit.entity';

const example_files_path = "./examples/";

// Note: A database must be deployed to run those tests

describe('Circuits e2e tests', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    // Remove all circuits from database before each test
    beforeEach(async () => {
        const uncleared = await request(app.getHttpServer()).get('/circuits');
        await Promise.all(
            uncleared.body.map(async (circuit: Circuit) => {
                return request(app.getHttpServer()).delete(`/circuits/${circuit.id}`);
            }),
        );
    });

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

        it("should return uploaded circuits", async () => {
            // Given uploaded circuits
            await request(app.getHttpServer())
                .post('/circuits')
                .attach("file", example_files_path + "adder.logic")
                .attach("file", example_files_path + "OR.logic")
                .attach("file", example_files_path + "triSeq.logic");

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

})