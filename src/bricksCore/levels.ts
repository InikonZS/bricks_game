import { Game } from "./core";

const template = [
    [0, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 0],
];
const template2 = [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
];

const template3 = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
];

const template4 = [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
];


export const levelGenerators = [
    () => Game.generateByTemplate(6, 6, 2, [[1, 1], [1, 1]]),
    () => Game.generateByTemplate(7, 7, 3, template4),
    () => Game.generateByTemplate(8, 8, 4, template3),
    () => Game.generateByTemplate(10, 10, 5, template3),
    () => Game.generateByTemplate(11, 11, 6, template2),
    () => Game.generateByTemplate(11, 11, 7, template2),
    () => Game.generateByTemplate(12, 12, 8, template),
]