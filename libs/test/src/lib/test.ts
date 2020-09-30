import { INestApplication } from '@nestjs/common';
import { entity, WaveDrom } from '@simulogic/core';
const request = require("supertest");

export const example_files_path = "./examples/";
export const circuit_filenames = ["adder.logic", "OR.logic", "triSeq.logic"];

interface SimuFileWaveDrom {
    filename: string,
    wavedrom: WaveDrom
}

const adder: SimuFileWaveDrom = {
    filename: "adder.simu",
    wavedrom: {
        signal: [
            { name: 'x0', wave: 'x1x' },
            { name: 'x1', wave: 'x0x' },
            { name: 'x2', wave: 'x1x' },
            { name: 'x3', wave: 'x1x' },
            { name: 'x4', wave: 'x1x' },
            { name: 'x5', wave: 'x0x' },
            { name: 'x6', wave: 'x0x' },
            { name: 'x7', wave: 'x1x' },
            { name: 'y0', wave: 'x1x' },
            { name: 'y1', wave: 'x0x' },
            { name: 'y2', wave: 'x0x' },
            { name: 'y3', wave: 'x1x' },
            { name: 'y4', wave: 'x1x' },
            { name: 'y5', wave: 'x1x' },
            { name: 'y6', wave: 'x1x' },
            { name: 'y7', wave: 'x1x' }
        ],
        foot: { tick: '- 0 3000 + ' }
    }
}

const OR_gate: SimuFileWaveDrom = {
    filename: "OR.simu",
    wavedrom: {
        signal: [{ name: 'a1', wave: 'x010.x' }, { name: 'a2', wave: 'x01.0x' }],
        foot: { tick: '- 0 50 650 1000 2000 + ' }
    }
}

const triSeq: SimuFileWaveDrom = {
    filename: "triSeq.simu",
    wavedrom: {
        signal: [
            {
                name: 'ss',
                wave: 'x0...........................................................................................................................x'
            },
            {
                name: 'sr',
                wave: 'x0...........................................................................................................................x'
            },
            {
                name: 'tri1En',
                wave: 'x0..1............0..............................1.......................0....................................................x'
            },
            {
                name: 'tri2En',
                wave: 'x0...............1..............................0.......................1....................................................x'
            },
            {
                name: 'e0',
                wave: 'x.10..10.10.10.10..10.10.10.10.10.10.10.10.10.10..10.10.10.10.10.10.10.1.0.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10x'
            },
            {
                name: 'e1',
                wave: 'x..1..01.01.01.01..01.01.01.01.01.01.01.01.01.01..01.01.01.01.01.01.01.0.1.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01x'
            },
            {
                name: 'clk',
                wave: 'x....1..0..1..0...1..0..1..0..1..0..1..0..1..0...1..0..1..0..1..0..1..0...1..0..1..0..1..0..1..0..1..0..1..0..1..0..1..0..1..x'
            }
        ],
        foot: {
            tick: '- 0 20 70 87 108 120 170 208 220 270 308 320 370 408 420 470 487 508 520 570 608 620 670 708 720 770 808 820 870 908 920 970 1008 1020 1070 1108 1120 1170 1208 1220 1270 1308 1320 1370 1408 1420 1470 1487 1508 1520 1570 1608 1620 1670 1708 1720 1770 1808 1820 1870 1908 1920 1970 2008 2020 2070 2108 2120 2170 2208 2220 2250 2270 2308 2320 2370 2408 2420 2470 2508 2520 2570 2608 2620 2670 2708 2720 2770 2808 2820 2870 2908 2920 2970 3008 3020 3070 3108 3120 3170 3208 3220 3270 3308 3320 3370 3408 3420 3470 3508 3520 3570 3608 3620 3670 3708 3720 3770 3808 3820 3870 3908 3920 3970 4000 + '
        }
    }
}

export const simu_files_wavedrom = [adder, OR_gate, triSeq];




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
 * Gets and returns all files of wanted table.
 * @param app server application previously compiled
 * @param table database table associated to the files (circuit or simulation)
 */
export const getFiles = async (app: INestApplication, table: entity) => {
    return await (await request(app.getHttpServer()).get(`/${table}s`)).body;
}

/**
 * Gets and returns first file of wanted table.
 * @param app server application previously compiled
 * @param table database table associated to the files (circuit or simulation)
 */
export const getFirstFile = async (app: INestApplication, table: entity) => {
    return (await getFiles(app, table))[0];
}
