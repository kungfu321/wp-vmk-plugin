#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs-extra");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pluginName = () => {
  return new Promise((resolve) => {
    rl.question('Plugin Name: ', (answer) => {
      if (!answer) {
        answer = 'WP VMK Plugin';
      }
      resolve(answer);
    })
  })
}

const pluginSlug = () => {
  return new Promise((resolve) => {
    rl.question('Plugin Slug: ', (answer) => {
      if (!answer) {
        answer = 'wp-vmk-plugin';
      }
      resolve(answer);
    })
  })
}

const pluginUrl = () => {
  return new Promise((resolve) => {
    rl.question('Plugin Url: ', (answer) => {
      if (!answer) {
        answer = 'https://vomanhkien.com';
      }
      resolve(answer);
    })
  })
}

const authorName = () => {
  return new Promise((resolve) => {
    rl.question('Author Name: ', (answer) => {
      if (!answer) {
        answer = 'Vo Manh Kien';
      }
      resolve(answer);
    })
  })
}

const authorEmail = () => {
  return new Promise((resolve) => {
    rl.question('Author Email: ', (answer) => {
      if (!answer) {
        answer = 'hi@vomanhkien.com';
      }
      resolve(answer);
    })
  })
}

const authorUrl = () => {
  return new Promise((resolve) => {
    rl.question('Author Url: ', (answer) => {
      if (!answer) {
        answer = 'WP VMK Plugin';
      }
      resolve(answer);
    })
  })
}

const pluginShortDesc = () => {
  return new Promise((resolve) => {
    rl.question('Plugin Short Desc: ', (answer) => {
      if (!answer) {
        answer = 'WP VMK Plugin';
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
    fs.rename('wp-vmk-plugin.php', `${slug}.php`)
      .then(() => resolve())
      .catch(err => console.error(err));
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
  } catch (error) {
    const { exec } = require('child_process');

    exec('git reset --hard', (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
  }
};

main();
