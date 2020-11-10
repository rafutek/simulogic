import { INestApplication } from '@nestjs/common';
import { entity, Interval, SignalNamesGroup, WaveDrom, WaveDromBase } from '@simulogic/core';
const request = require("supertest");

export const example_files_folder = "./examples/";

// Remember, a circuit simulator might be executed with several simulation files,
// and a simulation file might be used by several circuit simulators.
// But for test purpose, we assume that a simulation file goes with one circuit simulator.

interface Filenames {
    simulation_filename: string,
    circuit_filename: string,
    result_filename: string
};

const adder: Filenames = {
    simulation_filename: "adder.simu",
    circuit_filename: "adder.logic",
    result_filename: "adder.out"
}
const OR_gate: Filenames = {
    simulation_filename: "OR_gate.simu",
    circuit_filename: "OR_gate.logic",
    result_filename: "OR_gate.out"
}
const triSeq: Filenames = {
    simulation_filename: "triSeq.simu",
    circuit_filename: "triSeq.logic",
    result_filename: "triSeq.out"
}

interface SimuFileWaveDrom {
    filename: string,
    expected_wavedrom: WaveDrom
}

const adder_wavedrom: SimuFileWaveDrom = {
    filename: adder.simulation_filename,
    expected_wavedrom: {
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

const OR_gate_wavedrom: SimuFileWaveDrom = {
    filename: OR_gate.simulation_filename,
    expected_wavedrom: {
        signal: [{ name: 'a1', wave: 'x010.x' }, { name: 'a2', wave: 'x01.0x' }],
        foot: { tick: '- 0 50 650 1000 2000 + ' }
    }
}

const triSeq_wavedrom: SimuFileWaveDrom = {
    filename: triSeq.simulation_filename,
    expected_wavedrom: {
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

export const simu_files_wavedrom = [adder_wavedrom, OR_gate_wavedrom, triSeq_wavedrom];


interface SimuFileIntervalWaveDrom {
    filename: string,
    interval: Interval,
    expected_wavedrom: WaveDrom
}

const adder_interval: SimuFileIntervalWaveDrom = {
    filename: adder.simulation_filename,
    interval: { start: 10, end: 100 },
    expected_wavedrom: {
        signal: [
            { name: 'x0', wave: '1.' },
            { name: 'x1', wave: '0.' },
            { name: 'x2', wave: '1.' },
            { name: 'x3', wave: '1.' },
            { name: 'x4', wave: '1.' },
            { name: 'x5', wave: '0.' },
            { name: 'x6', wave: '0.' },
            { name: 'x7', wave: '1.' },
            { name: 'y0', wave: '1.' },
            { name: 'y1', wave: '0.' },
            { name: 'y2', wave: '0.' },
            { name: 'y3', wave: '1.' },
            { name: 'y4', wave: '1.' },
            { name: 'y5', wave: '1.' },
            { name: 'y6', wave: '1.' },
            { name: 'y7', wave: '1.' }
        ],
        foot: { tick: '10 100 x ' }
    }
};

const OR_interval: SimuFileIntervalWaveDrom = {
    filename: OR_gate.simulation_filename,
    interval: { start: 0, end: 100 },
    expected_wavedrom: {
        signal: [{ name: 'a1', wave: 'x01.' }, { name: 'a2', wave: 'x01.' }],
        foot: { tick: '- 0 50 100 x ' }
    }
};

const triSeq_interval: SimuFileIntervalWaveDrom = {
    filename: triSeq.simulation_filename,
    interval: { start: 3800, end: 10000 },
    expected_wavedrom: {
        signal: [
            { name: 'ss', wave: '0......x.' },
            { name: 'sr', wave: '0......x.' },
            { name: 'tri1En', wave: '0......x.' },
            { name: 'tri2En', wave: '1......x.' },
            { name: 'e0', wave: '0.10.10x.' },
            { name: 'e1', wave: '1.01.01x.' },
            { name: 'clk', wave: '10..1..x.' }
        ],
        foot: { tick: '3800 3808 3820 3870 3908 3920 3970 4000 10000 + ' }
    }
};

export const simu_files_intervals = [adder_interval, OR_interval, triSeq_interval];

interface SimuFileWiresWaveDrom {
    simu_filename: string,
    selected_wires: string[],
    expected_wavedrom: WaveDrom
}

const adder_wires: SimuFileWiresWaveDrom = {
    simu_filename: adder.simulation_filename,
    selected_wires: ["x0", "x1", "x2"],
    expected_wavedrom: {
        signal: [
            { name: 'x0', wave: 'x1x' },
            { name: 'x1', wave: 'x0x' },
            { name: 'x2', wave: 'x1x' }
        ],
        foot: { tick: '- 0 3000 + ' }
    }
}

const OR_wires: SimuFileWiresWaveDrom = {
    simu_filename: OR_gate.simulation_filename,
    selected_wires: [],
    expected_wavedrom: {
        signal: [{ name: 'a1', wave: 'x010.x' }, { name: 'a2', wave: 'x01.0x' }],
        foot: { tick: '- 0 50 650 1000 2000 + ' }
    }
}

const triSeq_wires: SimuFileWiresWaveDrom = {
    simu_filename: triSeq.simulation_filename,
    selected_wires: ["ss", "tri1En", "e0"],
    expected_wavedrom: {
        signal: [
            {
                name: 'ss',
                wave: 'x0...........................................................................................................................x'
            },
            {
                name: 'tri1En',
                wave: 'x0..1............0..............................1.......................0....................................................x'
            },
            {
                name: 'e0',
                wave: 'x.10..10.10.10.10..10.10.10.10.10.10.10.10.10.10..10.10.10.10.10.10.10.1.0.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10x'
            }
        ],
        foot: {
            tick: '- 0 20 70 87 108 120 170 208 220 270 308 320 370 408 420 470 487 508 520 570 608 620 670 708 720 770 808 820 870 908 920 970 1008 1020 1070 1108 1120 1170 1208 1220 1270 1308 1320 1370 1408 1420 1470 1487 1508 1520 1570 1608 1620 1670 1708 1720 1770 1808 1820 1870 1908 1920 1970 2008 2020 2070 2108 2120 2170 2208 2220 2250 2270 2308 2320 2370 2408 2420 2470 2508 2520 2570 2608 2620 2670 2708 2720 2770 2808 2820 2870 2908 2920 2970 3008 3020 3070 3108 3120 3170 3208 3220 3270 3308 3320 3370 3408 3420 3470 3508 3520 3570 3608 3620 3670 3708 3720 3770 3808 3820 3870 3908 3920 3970 4000 + '
        }
    }
}

export const simu_files_wires = [adder_wires, OR_wires, triSeq_wires];


export interface SimuRsltFileWaveDrom {
    circuit_filename: string,
    simu_file_wavedrom: SimuFileWaveDrom,
    expected_combined_wavedrom: WaveDromBase
}

const adder_rslt: SimuRsltFileWaveDrom = {
    circuit_filename: adder.circuit_filename,
    simu_file_wavedrom: adder_wavedrom,
    expected_combined_wavedrom: {
        signal: [
            [
                'input',
                { name: 'x0', wave: 'x1.......x' },
                { name: 'x1', wave: 'x0.......x' },
                { name: 'x2', wave: 'x1.......x' },
                { name: 'x3', wave: 'x1.......x' },
                { name: 'x4', wave: 'x1.......x' },
                { name: 'x5', wave: 'x0.......x' },
                { name: 'x6', wave: 'x0.......x' },
                { name: 'x7', wave: 'x1.......x' },
                { name: 'y0', wave: 'x1.......x' },
                { name: 'y1', wave: 'x0.......x' },
                { name: 'y2', wave: 'x0.......x' },
                { name: 'y3', wave: 'x1.......x' },
                { name: 'y4', wave: 'x1.......x' },
                { name: 'y5', wave: 'x1.......x' },
                { name: 'y6', wave: 'x1.......x' },
                { name: 'y7', wave: 'x1.......x' }
            ],
            [
                'output',
                { name: 's0', wave: 'x.0......x' },
                { name: 's1', wave: 'x..1.....x' },
                { name: 's8', wave: 'x..1.....x' },
                { name: 's4', wave: 'x...1....x' },
                { name: 's5', wave: 'x...0....x' },
                { name: 's2', wave: 'x....1...x' },
                { name: 's6', wave: 'x.....0..x' },
                { name: 's3', wave: 'x......0.x' },
                { name: 's7', wave: 'x.......1x' }
            ]
        ],
        foot: { tick: '- 0 100 200 300 400 500 600 700 3000 + ' }
    }
};

export const Or_gate_rslt: SimuRsltFileWaveDrom = {
    circuit_filename: OR_gate.circuit_filename,
    simu_file_wavedrom: OR_gate_wavedrom,
    expected_combined_wavedrom: {
        signal: [
            [
                'input',
                { name: 'a1', wave: 'x01..0..x' },
                { name: 'a2', wave: 'x01...0.x' }
            ],
            ['output', { name: 's1', wave: 'x..01..0x' }]
        ],
        foot: { tick: '- 0 50 100 150 650 1000 1100 2000 + ' }
    }
}

const triSeq_rslt: SimuRsltFileWaveDrom = {
    circuit_filename: triSeq.circuit_filename,
    simu_file_wavedrom: triSeq_wavedrom,
    expected_combined_wavedrom: {
        signal: [
            [
                'input',
                {
                    name: 'ss',
                    wave: 'x0...............................................................................................................................x'
                },
                {
                    name: 'sr',
                    wave: 'x0...............................................................................................................................x'
                },
                {
                    name: 'tri1En',
                    wave: 'x0..1.............0...............................1........................0.....................................................x'
                },
                {
                    name: 'tri2En',
                    wave: 'x0................1...............................0........................1.....................................................x'
                }
            ],
            [
                'output',
                {
                    name: 'e0',
                    wave: 'x.10..1.0.10.10.10..1.0.10.10.10.10.10.10.10.10.10..1.0.10.10.10.10.10.10.1.0.1.0.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10.10x'
                },
                {
                    name: 'e1',
                    wave: 'x..1..0.1.01.01.01..0.1.01.01.01.01.01.01.01.01.01..0.1.01.01.01.01.01.01.0.1.0.1.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01x'
                },
                {
                    name: 'clk',
                    wave: 'x....1...0..1..0...1...0..1..0..1..0..1..0..1..0...1...0..1..0..1..0..1..0...1...0..1..0..1..0..1..0..1..0..1..0..1..0..1..0..1..x'
                },
                {
                    name: 'out',
                    wave: 'x......0.............1...............................0.........................1.................................................x'
                }
            ]
        ],
        foot: {
            tick: '- 0 20 70 87 108 120 150 170 208 220 270 308 320 370 408 420 470 487 508 520 550 570 608 620 670 708 720 770 808 820 870 908 920 970 1008 1020 1070 1108 1120 1170 1208 1220 1270 1308 1320 1370 1408 1420 1470 1487 1508 1520 1550 1570 1608 1620 1670 1708 1720 1770 1808 1820 1870 1908 1920 1970 2008 2020 2070 2108 2120 2170 2208 2220 2250 2270 2308 2320 2350 2370 2408 2420 2470 2508 2520 2570 2608 2620 2670 2708 2720 2770 2808 2820 2870 2908 2920 2970 3008 3020 3070 3108 3120 3170 3208 3220 3270 3308 3320 3370 3408 3420 3470 3508 3520 3570 3608 3620 3670 3708 3720 3770 3808 3820 3870 3908 3920 3970 4000 + '
        }
    }
}

interface SimuFileSignalsNamesGroup {
    simu_filename: string,
    signals_names_group: SignalNamesGroup
}

export const adder_signals_names: SimuFileSignalsNamesGroup = {
    simu_filename: adder.simulation_filename,
    signals_names_group: {
        group_name: "input",
        signals_names: ["x0", "x1", "x2", "x3", "x4", "x5", "x6", "x7", "y0", "y1", "y2", "y3", "y4", "y5", "y6", "y7"]
    }
}

export const simu_rslt_files_wavedrom = [adder_rslt, Or_gate_rslt, triSeq_rslt];
export const circuit_filenames = simu_rslt_files_wavedrom.map(el => el.circuit_filename);
export const simulator_filenames = simu_rslt_files_wavedrom.map(el => el.circuit_filename.replace("logic", "exe"));
export const simu_filenames = simu_rslt_files_wavedrom.map(el => el.simu_file_wavedrom.filename);

/**
 * Converts a filename to a filepath.
 * @param filename name of the file
 */
export const filenameToFilepath = (filename: string) => {
    return example_files_folder + filename;
}

/**
 * Converts an array of filenames to an array of filepaths.
 * @param filenames array containing the names of the files
 */
export const filenamesToFilepaths = (filenames: string[]) => {
    return filenames.map(filename => filenameToFilepath(filename));
}


export const circuit_filepaths = filenamesToFilepaths(circuit_filenames);
const simulators_folder = "./examples/simulators/";
export const simulators_filepaths = simulator_filenames.map(filename => simulators_folder + filename);
export const simu_filepaths = filenamesToFilepaths(simu_filenames);

interface SimuExecution {
    simulator_filepath: string,
    simu_filepath: string,
    rslt_file_content: string
}

const adder_execution: SimuExecution = {
    simulator_filepath: simulators_filepaths[0],
    simu_filepath: simu_filepaths[0],
    rslt_file_content: `START_TIME 0
END_TIME 3000
EVENT s0 F 100
EVENT s1 T 200
EVENT s2 T 400
EVENT s3 F 600
EVENT s4 T 300
EVENT s5 F 300
EVENT s6 F 500
EVENT s7 T 700
EVENT s8 T 200
`
};

const OR_execution: SimuExecution = {
    simulator_filepath: simulators_filepaths[1],
    simu_filepath: simu_filepaths[1],
    rslt_file_content: `START_TIME 0
END_TIME 2000
EVENT s1 F 100
EVENT s1 T 150
EVENT s1 F 1100
`
};

const triSeq_execution: SimuExecution = {
    simulator_filepath: simulators_filepaths[2],
    simu_filepath: simu_filepaths[2],
    rslt_file_content: `START_TIME 0
END_TIME 4000
CLOCK e0 20 100 50
CLOCK e1 70 100 50
CLOCK clk 108 200 50
EVENT out F 150
EVENT out T 550
EVENT out F 1550
EVENT out T 2350
`
};

export const simu_executions: SimuExecution[] = [adder_execution, OR_execution, triSeq_execution];

/**
 * Uploads a file to the server.
 * @param app server application previously compiled
 * @param filename name of the file to upload
 * @param table database table associated to the file (circuit or simulation)
 */
export const uploadFileTo = async (app: INestApplication, filename: string, table: entity) => {
    await request(app.getHttpServer()).post(`/${table}s`).attach("file", filenameToFilepath(filename));
}

/**
 * Uploads some files to the server.
 * @param app server application previously compiled
 * @param filenames names of the files to upload
 * @param table database table associated to the files (circuit or simulation)
 */
export const uploadFilesTo = async (app: INestApplication, filenames: string[], table: entity) => {
    await Promise.all(filenames.map(filename => uploadFileTo(app, filename, table)));
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

/**
 * Deletes wanted file from server.
 * @param app server application previously compiled
 * @param table database table containing the file entity
 * @param file_uuid uuid of the file in the table
 */
export const deleteFile = async (app: INestApplication, table: entity, file_uuid: string) => {
    await request(app.getHttpServer()).delete(`/${table}s/${file_uuid}`);
}
