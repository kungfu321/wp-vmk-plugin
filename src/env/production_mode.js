var glob = require('glob');
var fs = require('fs');

// For entry file selection
glob("wp-vmk-plugin.php", function(err, files) {
        files.forEach(function(item, index, array) {
        var data = fs.readFileSync(item, 'utf8');
        var mapObj = {
            WPVMKPLUGIN_DEVELOPMENT : "WPVMKPLUGIN_PRODUCTION"
        };
        var result = data.replace(/WPVMKPLUGIN_DEVELOPMENT/gi, function(matched){
            return mapObj[matched];
        });
        fs.writeFile(item, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
        console.log('✅  Development asset enqueued!');
    });
});