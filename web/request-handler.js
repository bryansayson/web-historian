var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('../web/http-helpers');
var qs = require('querystring');

// var get = function(req, res) {
//   var parsedUri = url.parse(req.url);
//   var website = archive.getWebsiteName(parsedUri.pathname);
//   if (parsedUri.pathname === '/') {
//     httpHelpers.serveAssets(res, archive.paths.siteAssets + '/index.html');
//   } else if (parsedUri.pathname === '/loading') {
//     httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html');
//   } else if ( archive.isURLArchived(website) ) {
//       httpHelpers.serveAssets(res, archive.paths.archivedSites + '/' + website);
//     // } 
//   } else {
//    res._responseCode(404);
//   }
// };


var get = function(req, res) {
  var parsedUri = url.parse(req.url);
  var website = archive.getWebsiteName(parsedUri.pathname);
  if (parsedUri.pathname === '/') {
    httpHelpers.serveAssets(res, archive.paths.siteAssets + '/index.html');
  } else if (parsedUri.pathname === '/loading') {
    httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html');
  } else if (parsedUri.pathname.charAt(0) === '/' ) {
    if ( !archive.isUrlInList(website) ){
      console.log( "IS URL IN LIST???" + archive.isUrlInList );
      httpHelpers.send404(res);
    } else {
      console.log( "IS URL IN LIST???" + archive.isUrlInList );
      httpHelpers.serveAssets(res, archive.paths.siteAssets + '/' + website);
    }
  }
};

var post = function(req, res) {
  console.log('post invoking');
  var body = "";
  req.on('data', function(data) {
    // console.log("HERE IS DATA: ", data);
    body += data;
  });

  req.on('end', function() {
    var website = body.slice(4);
    console.log("HI IM A WEBSITE >>>> ", website);
    archive.readListOfUrls(function(){
      if ( !archive.isUrlInList(website) )   {
      archive.addUrlToList(website);
      httpHelpers.sendRedirect(res, '/loading');
      } else {
        archive.isURLArchived(website, function(exists){
          if (exists) {
            httpHelpers.sendRedirect(res, '/' + website);
          } else {
            httpHelpers.sendRedirect(res, '/loading');
          }
        });
      }
    });
  });
  // var website = req._postData.url;
  // archive.readListOfUrls(function(){
  //   if ( !archive.isUrlInList(website) )   {
  //     archive.addUrlToList(website);
  //     httpHelpers.sendRedirect(res, '/loading');
  //     // alert('website is already archived');
  //   } else {
  //     httpHelpers.sendRedirect(res, '/loading');
  //   }
  // });
};

var methods = {
  'GET': get,
  'POST': post
};

exports.handleRequest = function (req, res) {
  console.log("Request type:" + req.method + "for" + req.url);
  var method = methods[req.method];
  method(req, res);
};
