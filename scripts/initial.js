#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs-extra");
const { exec } = require('child_process');

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
  pluginShortDesc: 'WP VMK Plugin',
  pluginPackage: 'WPVMKPLUGIN',
  adminOnly: '0'
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

const adminOnly = () => {
  return new Promise((resolve) => {
    rl.question('Admin Only (0/1): ', (answer) => {
      if (!answer) {
        resolve(initialValue.adminOnly);
      }
      resolve(answer);
    })
  })
}

const updatePackageJson = async (slug, desc) => {
  if (slug === initialValue.pluginSlug && desc === initialValue.pluginShortDesc) return;
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
  if (slug === initialValue.pluginSlug) return;
  return new Promise((resolve) => {
    fs.rename(`${initialValue.pluginSlug}.php`, `${slug}.php`)
      .then(() => resolve())
      .catch(err => console.error(err));
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

const removeBlockInFile = async (filePath, startMarker, endMarker) => {
  let fileContent = await fs.readFile(filePath, 'utf8');

  const regex = new RegExp(`${startMarker}[\\s\\S]*${endMarker}`, 'gm');
  fileContent = fileContent.replace(regex, '');

  await fs.writeFile(filePath, fileContent);
}

const removeFEFile = async () => {
  try {
    await removeBlockInFile(
      `${initialValue.pluginSlug}.php`,
      '// START frontend',
      '// END frontend'
    );
    await removeBlockInFile(
      `${initialValue.pluginSlug}.php`,
      '// START renderFrontendPage',
      '// END renderFrontendPage'
    );
    await removeBlockInFile(
      'includes/Classes/LoadAssets.php',
      '// START frontend',
      '// END frontend'
    );

    exec('rm -rf src/frontend');
    exec('rm -rf includes/Classes/FrontendAjaxHandler.php');

    await changePluginContent([
      'vite.config.js'
    ], "'src/frontend/frontend.js',", "");
  } catch (error) {
    console.log(error);
  }
}

const main = async () => {
  const pluginNameAnswer = await pluginName();
  const pluginSlugAnswer = await pluginSlug();
  const pluginUrlAnswer = await pluginUrl();
  const authorNameAnswer = await authorName();
  const authorUrlAnswer = await authorUrl();
  const pluginShortDescAnswer = await pluginShortDesc();
  const adminOnlyAnswer = await adminOnly();
  rl.close();

  try {
    if (Number(adminOnlyAnswer) === 1) {
      await removeFEFile();
    }

    await updatePackageJson(pluginSlugAnswer, pluginShortDescAnswer);
    await renameFile(pluginSlugAnswer);

    // change plugin slug content
    await changePluginContent([
      `${pluginSlugAnswer}.php`,
      'scripts/build-zip.js',
      'src/env/development_mode.js',
      'src/env/production_mode.js'
    ], initialValue.pluginSlug, pluginSlugAnswer);

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

    // change plugin url
    await changePluginContent([
      `${pluginSlugAnswer}.php`,
    ], initialValue.pluginUrl, pluginUrlAnswer);

    // change author url
    await changePluginContent([
      `${pluginSlugAnswer}.php`,
    ], initialValue.authorUrl, authorUrlAnswer);

    // change plugin short desc
    await changePluginContent([
      `${pluginSlugAnswer}.php`,
    ], initialValue.pluginShortDesc, pluginShortDescAnswer);

    // change plugin Package
    await changePluginContent([
      `${pluginSlugAnswer}.php`,
      'includes/autoload.php',
      'includes/global_functions.php',
      'includes/Classes/Activator.php',
      'includes/Classes/LoadAssets.php',
      'includes/Classes/Vite.php',
      'includes/Classes/AdminAjaxHandler.php',
      'includes/Classes/FrontendAjaxHandler.php',
      'src/admin/admin.js',
      'src/admin/Bits/AJAX.js',
      'src/env/development_mode.js',
      'src/env/production_mode.js',
      'src/frontend/frontend.js',
      'src/admin/Bits/Plugin.js'
    ], initialValue.pluginPackage,
      `${pluginNameAnswer}`.toUpperCase().replaceAll(' ', '')
    );

    // exec('rm -rf .git');

  } catch (error) {
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
