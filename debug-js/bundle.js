const fse = require('fs-extra');
const fs = require('fs');
//const archiver = require('archiver');
//const asar = require('asar');
//const config = require('./config');
//const constants = require('../constants');
//const utils = require('../utils');
const editJsonFile = require('edit-json-file');

const constants = {
    remote: {
        binariesUrl: "https://github.com/neutralinojs/neutralinojs/releases/download/{tag}/neutralinojs-{tag}.zip",
        clientUrlPrefix: "https://github.com/neutralinojs/neutralino.js/releases/download/{tag}/neutralino.",
        templateUrl: "https://github.com/{template}/archive/main.zip"
    },
    files: {
        configFile: "neutralino.config.json",
        clientLibraryPrefix: "neutralino.",
        resourceFile: "resources.neu",
        authFile: ".tmp/auth_info.json",
        binaries: {
            linux: {
                x64: "neutralino-linux_x64",
                armhf: "neutralino-linux_armhf",
                arm64: "neutralino-linux_arm64"
            },
            darwin: {
                x64: "neutralino-mac_x64",
                arm64: "neutralino-mac_arm64"
            },
            win32: {
                x64: "neutralino-win_x64.exe"
            }
        },
        dependencies: ["WebView2Loader.dll"]
    },
    misc: {
        hotReloadLibPatchRegex: /(<script.*src=")(.*neutralino.js)(".*><\/script>)/g,
        hotReloadGlobPatchRegex: /(<script.*src=")(.*__neutralino_globals.js)(".*><\/script>)/g
    }
}

const config = {
    update: (key, value) => {
        let file = editJsonFile(constants.files.configFile);
        file.set(key, value);
        file.save();
    },
    get: () => {
        let file = editJsonFile(constants.files.configFile);
        return file.get();
    }
}

const utils = {
    trimPath: (path) => {
        return path?.replace(/^\//, '');
    }
}


async function createAsarFile() {
    console.log(`Generating ${constants.files.resourceFile}...`);
    const configObj = config.get();
    const resourcesDir = utils.trimPath(configObj.cli.resourcesPath);
    const extensionsDir = utils.trimPath(configObj.cli.extensionsPath);
    const clientLibrary = configObj.cli.clientLibrary ? utils.trimPath(configObj.cli.clientLibrary)
        : null;
    const icon = utils.trimPath(configObj.modes.window.icon);
    const binaryName = configObj.cli.binaryName;

    fs.mkdirSync(`.tmp`, { recursive: true });
    console.log(`.tmp/${resourcesDir}`);
    //await fse.copy(`./${resourcesDir}`, `.tmp/${resourcesDir}`, { overwrite: true });

    if (extensionsDir && fs.existsSync(extensionsDir)) {
        await fse.copy(`./${extensionsDir}`, `dist/${binaryName}/${extensionsDir}`, { overwrite: true });
    }

    await fse.copy(`${constants.files.configFile}`, `.tmp/${constants.files.configFile}`, { overwrite: true });
    if (clientLibrary) {
        await fse.copy(`./${clientLibrary}`, `.tmp/${clientLibrary}`, { overwrite: true });
    }
    await fse.copy(`./${icon}`, `.tmp/${icon}`, { overwrite: true });

    //await asar.createPackage('.tmp', `dist/${binaryName}/${constants.files.resourceFile}`);
}

createAsarFile();