#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs-extra");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const initialValue = {
  pluginName: 'WP VMK Plugin',
  pluginSlug: 'wp-vmk-plugin',
  pluginUrl: 'https://vomanhkien.com/wp-vmk-plugin',
  authorUrl: 'https://vomanhkien.com',
  authorName: 'Vo Manh Kien',
  authorEmail: 'hi@vomanhkien.com',
  pluginShortDesc: 'WP VMK Plugin'
};

const pluginName = () => {
  return new Promise((resolve) => {
    rl.question('Plugin Name: ', (answer) => {
      if (!answer) {
        resolve(initialValue.pluginName);
      }
      resolve(answer);
    })
  })
}

const pluginSlug = () => {
  return new Promise((resolve) => {
    rl.question('Plugin Slug: ', (answer) => {
      if (!answer) {
        resolve(initialValue.pluginSlug);
      }
      resolve(answer);
    })
  })
}

const pluginUrl = () => {
  return new Promise((resolve) => {
    rl.question('Plugin Url: ', (answer) => {
      if (!answer) {
        resolve(initialValue.pluginUrl);
      }
      resolve(answer);
    })
  })
}

const authorName = () => {
  return new Promise((resolve) => {
    rl.question('Author Name: ', (answer) => {
      if (!answer) {
        resolve(initialValue.authorName);
      }
      resolve(answer);
    })
  })
}

const authorEmail = () => {
  return new Promise((resolve) => {
    rl.question('Author Email: ', (answer) => {
      if (!answer) {
        resolve(initialValue.authorEmail);
      }
      resolve(answer);
    })
  })
}

const authorUrl = () => {
  return new Promise((resolve) => {
    rl.question('Author Url: ', (answer) => {
      if (!answer) {
        resolve(initialValue.authorUrl);
      }
      resolve(answer);
    })
  })
}

const pluginShortDesc = () => {
  return new Promise((resolve) => {
    rl.question('Plugin Short Desc: ', (answer) => {
      if (!answer) {
        resolve(initialValue.pluginShortDesc);
      }
      resolve(answer);
    })
  })
}

const updatePackageJson = async (slug, desc) => {
  return new Promise((resolve) => {
    fs.readFile('package.json', 'utf8', function (err, data) {
      if (err) throw err;

      let obj = JSON.parse(data);

      obj.name = slug;
      obj.description = desc;

      let json = JSON.stringify(obj, null, 2);

      fs.writeFile('package.json', json, 'utf8', function (err) {
        if (err) throw err;
        resolve();
      });
    });
  });
}

const renameFile = async (slug) => {
  return new Promise((resolve) => {
    fs.rename(`${initialValue.pluginSlug}.php`, `${slug}.php`)
      .then(() => resolve())
      .catch(err => console.error(err));
  });
}

const changePluginContent = async (files, oldContent, newContent) => {
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
  const pluginNameAnswer = await pluginName();
  const pluginSlugAnswer = await pluginSlug();
  const pluginUrlAnswer = await pluginUrl();
  const authorNameAnswer = await authorName();
  const authorEmailAnswer = await authorEmail();
  const authorUrlAnswer = await authorUrl();
  const pluginShortDescAnswer = await pluginShortDesc();
  rl.close();

  try {
    await updatePackageJson(pluginSlugAnswer, pluginShortDescAnswer);
    await renameFile(pluginSlugAnswer);
    
    // change plugin slug content
    await changePluginContent([
      `${pluginSlugAnswer}.php`,
      'scripts/build-zip.js',
      'src/env/development_mode.js',
      'src/env/production_mode.js'
    ], `${pluginSlugAnswer}.php`, pluginSlugAnswer);

    // change plugin name
    await changePluginContent([
      `${pluginSlugAnswer}.php`,
      'readme.txt',
    ], initialValue.pluginName, pluginNameAnswer);

    // change author name
    await changePluginContent([
      `${pluginSlugAnswer}.php`,
      'readme.txt',
    ], initialValue.authorName, authorNameAnswer);
  } catch (error) {
    const { exec } = require('child_process');

    exec('git reset --hard && git clean -fxd', (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.error('Something went wrong.');
    });
  }
};

main();
