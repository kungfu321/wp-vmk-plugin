#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs-extra");

const extractExtensionData = () => {
  const extPackageJson = require("../package.json");

  return {
    name: extPackageJson.name,
    version: extPackageJson.version,
  };
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const newVersion = (current) => {
  return new Promise((resolve) => {
    rl.question('New version (auto if empty): ', (answer) => {
      if (!answer) {
        let autoNewVersion = current.split('.');
        autoNewVersion[2] = parseInt(autoNewVersion[2], 10) + 1;
        autoNewVersion = autoNewVersion.join('.');
        resolve(autoNewVersion);
      }
      resolve(answer);
    })
  })
}

const updatePackageJson = async (version) => {
  return new Promise((resolve) => {
    fs.readFile('package.json', 'utf8', function (err, data) {
      if (err) throw err;

      let obj = JSON.parse(data);

      obj.version = version;

      let json = JSON.stringify(obj, null, 2);

      fs.writeFile('package.json', json, 'utf8', function (err) {
        if (err) throw err;
        resolve();
      });
    });
  });
}

const changePluginContent = async (files, oldContent, newContent) => {
  if (oldContent === newContent) return;
  return new Promise((resolve, reject) => {
    files.forEach(file => {
      fs.readFile(file, 'utf8')
        .then(data => {
          const updatedData = data.replaceAll(oldContent, newContent);

          return fs.writeFile(file, updatedData, 'utf8');
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  });
}

const main = async () => {
  const { version, name } = extractExtensionData();
  const newVersionAnswer = await newVersion(version);
  rl.close();

  await updatePackageJson(newVersionAnswer);
  await changePluginContent([
    `${name}.php`,
  ], version, newVersionAnswer);
};

main();
