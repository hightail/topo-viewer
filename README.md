topo-editor
======

#Summary
Tools to load and view TOPO's

#Getting started
##Prerequisites
You have the following setup on your machine before starting

* Git
* Git SSH keys for the TOPOs repository
* Node
* Grunt
* Bower

##Clone the repo
```
git clone https://github.com/hightail/topo-viewer.git
```

##Install dependencies
```
~/topo-viewer $ npm install; bower install;
```

##Start the server
There is a grunt "server" task to run the application.

```
~/topo-viewer $ grunt server
```

This is the default task so you can also just run:

```
~/topo-viewer $ grunt
```

##Open in browser
By default TOPO viewer runs on localhost port 5000

```
http://localhost:5000/
```


See the Gruntfile.js for more info.

#Features
* Easily select specific environments and TOPO keys to view
* Show fully resolved TOPO values (all variables will be replaced with the correct value for each environment)
* Show/hide default values
* Links to TOPO files in Stash
