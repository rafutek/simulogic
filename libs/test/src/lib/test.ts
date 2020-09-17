import { INestApplication } from '@nestjs/common';
import { entity } from '@simulogic/core';
const request = require("supertest");

export const example_files_path = "./examples/";
export const circuit_filenames = ["adder.logic", "OR.logic", "triSeq.logic"];
export const simu_filenames = ["adder.simu", "OR.simu", "triSeq.simu"];

/**
 * Uploads some files to the server.
 * @param app server application previously compiled
 * @param filenames names of the files to upload
 * @param table database table associated to the files (circuit or simulation)
 */
export const uploadFilesTo = async (app: INestApplication, filenames: string[], table: entity) => {
    await Promise.all(
        filenames.map(filename => {
            return request(app.getHttpServer())
                .post(`/${table}s`)
                .attach("file", example_files_path + filename);
        }));
}

/**
 * Clears database table and deletes associated files.
 * GET and DELETE requests must work.
 * @param app server application previously compiled
 * @param table database table associated to the files (circuit or simulation)
 */
export const clearTableAndFiles = async (app: INestApplication, table: entity) => {
    const uncleared = await request(app.getHttpServer()).get(`/${table}s`);
    const entities_to_delete: [] = uncleared.body;
    await Promise.all(
        entities_to_delete.map((entity: any) => {
            return request(app.getHttpServer()).delete(`/${table}s/${entity.uuid}`);
        })
    );
}

/**
 * Gets and returns first file of wanted table.
 * @param app server application previously compiled
 * @param table database table associated to the files (circuit or simulation)
 */
export const getFirstFile = async (app: INestApplication, table: entity) => {
    return await (await request(app.getHttpServer()).get(`/${table}s`)).body[0];
}
