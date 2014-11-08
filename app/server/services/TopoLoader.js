var git = require("gift"),
    fs = require("fs"),
    path = require("path"),
    Q = require('q');

var TOPO_STASH_REPO_PATH = "ssh://git@stash01.corp.hightail.com:7999/topos/topos.git";
var TOPO_LOCAL_REPO_PATH = "topo-repo";

function loadFromGit(filePath, treeish) {
  var deferred = Q.defer();

  function getFileAtRevision(repo) {
    repo.checkout(treeish, function() {
      //console.log('git checkout ' + treeish + ' complete');

      var fullFilePath = path.join(TOPO_LOCAL_REPO_PATH, filePath);

      fs.exists(fullFilePath, function(exists) {
        if(exists) {
          fs.readFile(fullFilePath, { encoding: 'utf8' }, function(err, data) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(data);
            }
          });
        } else {
          deferred.reject({
            message: 'Error locating file: ' + fullFilePath
          });
        }
      });
    });
  }

  fs.exists(TOPO_LOCAL_REPO_PATH, function(exists) {
    if(exists) {
      console.log('Repo already exists');
      getFileAtRevision(git(TOPO_LOCAL_REPO_PATH));
    } else {
      git.clone(TOPO_STASH_REPO_PATH, TOPO_LOCAL_REPO_PATH, function(err, repo) {
        console.log('err', err);
        if(err) {
          deferred.reject(err);
        } else {
          getFileAtRevision(repo);
        }
      });
    }
  })


  return deferred.promise;
}

var TopoLoader = {
  loadFromGit: loadFromGit
};

module.exports =  TopoLoader;
