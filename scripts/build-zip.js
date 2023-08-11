#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");

const DEST_DIR = path.join(__dirname, "../dist");
const ROOT_DIR = path.join(__dirname, "../");
const DEST_ZIP_DIR = path.join(__dirname, "../dist-zip");

const extractExtensionData = () => {
  const extPackageJson = require("../package.json");

  return {
    name: extPackageJson.name,
    version: extPackageJson.version,
  };
};

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR);
  }
};

const copyFileToDistIfExists = () => {
  fs.removeSync(DEST_ZIP_DIR);

  fs.copySync(ROOT_DIR + "assets", DEST_DIR + "/assets");
  fs.copySync(ROOT_DIR + "includes", DEST_DIR + "/includes");

  fs.copySync(ROOT_DIR + "index.php", DEST_DIR + "/index.php");
  fs.copySync(ROOT_DIR + "wp-vmk-plugin.php", DEST_DIR + "/wp-vmk-plugin.php");
};

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`);

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(path.join(dist, zipFilename));

  return new Promise((resolve, reject) => {
    archive
      .directory(src, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
};

const main = () => {
  const { name } = extractExtensionData();
  const zipFilename = `${name}.zip`;

  copyFileToDistIfExists();
  makeDestZipDirIfNotExists();

  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
    .then(() => {
      console.info("Remove dist folder ...");
      fs.removeSync(DEST_DIR);
      console.info("OK");
    })
    .catch(console.err);
};

main();
