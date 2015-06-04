var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var list = [];

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  cb = cb || function(){};
  // console.log("Path: >>>>>> " + exports.paths.list);
  fs.readFile(exports.paths.list, "utf8", function(err, data){
    if (err) throw err;
    list = data.toString().split('\n');
     // console.log("LIST AFTER READLISTOFURLS:" +  list);
    cb(list);
  });
};

exports.isUrlInList = function(website){
  // check if website is in 
  var cb = function (list) {
    return list.indexOf(website) !== -1;
  };

return exports.readListOfUrls(cb);

};

exports.addUrlToList = function(website){
  // write website name to sites.txt
  // list.push(website);
  fs.appendFile(exports.paths.list, website + '\n', function(err){
    if (err) throw err;
    // console.log(website, " was appended to file!");
  });
};

exports.isURLArchived = function(url){
  exports.readListOfUrls();
  return list.indexOf(url) !== -1;
};

exports.downloadUrls = function(){
};

exports.getWebsiteName = function  ( pathname ) {
  return pathname.slice(1);
}
