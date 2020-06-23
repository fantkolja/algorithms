import { fork } from 'child_process';
import { lstatSync, readdirSync } from'fs';
import { resolve } from 'path';
import { prompt } from 'inquirer';

const ALGORITHMS_ROOT = 'algorithms';

function isDirectory(source) {
    return lstatSync(source).isDirectory();
}
function getDirectories(source) {
    return readdirSync(source).reduce((dirs, name) => {
        if (isDirectory(resolve(source, name))) {
            dirs.push(name);
        }
        return dirs;
      }, [])
}
function runAlgorithm(algorithm) {
    console.log(`Running "${algorithm}"...\n`);
    const subprocess = fork(`./${ALGORITHMS_ROOT}/${algorithm}`, ['-r', 'ts-node/register']);
}

function isProvidedByUser(algorithms, argAlgorithm) {
    return argAlgorithm
     && algorithms.find(dir => dir.toLowerCase() === argAlgorithm.toLowerCase());
}

async function main() {
    const argAlgorithm = process.argv[2];
    const directories = getDirectories(resolve(__dirname, ALGORITHMS_ROOT));

    if (isProvidedByUser(directories, argAlgorithm)) {
        runAlgorithm(argAlgorithm);
    } else {
        const { algorithmChoice } = await prompt({
            type: 'list',
            name: 'algorithmChoice',
            message: 'Please choose an algorithm to be launched!',
            choices: directories,
        });
        runAlgorithm(algorithmChoice);
    }
}
main();