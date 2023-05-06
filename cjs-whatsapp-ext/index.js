const { port, accessToken } = require('../.tmp/auth_info.json')
const neuConfig = require("../neutralino.config.json");
process.argv.push(`--nl-port=${port}`)
process.argv.push(`--nl-token=${accessToken}`)
process.argv.push(`--nl-extension-id=${neuConfig.extensions[0].id}`);
console.log(process.argv);
require("./dist/cjs-whatsapp-ext");