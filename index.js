const fs = require("fs");
const jszip = require("jszip");

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    });
}
async function run() {

    console.log("");
    console.log("I wish you luck!");

    // get content json
    console.log(' ┃');
    console.log(' ┣━━ 1. Get your JSON');
    const art = await readFile("./art.json");

    // get file .xd
    console.log(' ┣━━ 2. Get empty file of Adobe XD');
    const data = await readFile("./empty.xd");

    // edit file
    console.log(' ┣━━ 3. Edit graphicContent.agc');
    const zip = await jszip.loadAsync(data);
    zip.file(`artwork/pasteboard/graphics/graphicContent.agc`, art, {
        createFolders: false,
        binary: false,
        compression: "DEFLATE",
        compressionOptions: {
            level: 1,
        },
    });

    // generate xd file
    console.log(' ┣━━ 4. Create Adobe XD');
    new Promise((resolve, reject) => {
        zip.generateNodeStream({
            type: "nodebuffer",
            streamFiles: false,
        })
            .pipe(fs.createWriteStream("./new.xd"))
            .on("finish", () => {
              console.log(' ┗━━ 5. ✓ Save Success!');
              console.log('');
              resolve();
            })
            .on("error", reject);
    });
}

run();
