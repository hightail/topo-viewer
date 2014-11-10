topo-editor
======

#Summary
Tools to load and view TOPO's

#Getting started
Clone the repo
```
git clone https://github.com/hightail/topo-viewer.git
```

Install dependencies
```
npm install; bower install;
```

There is a grunt "server" task to install dependencies and run the application.

```
~/topo-viewer $ grunt server
```

This is the default task so you can also just run:

```
~/topo-viewer $ grunt
```

See the Gruntfile.js for more info.

#Features
Easily select specific environments and TOPO keys to view
Show fully resolved TOPO values (all variables will be replaced with the correct value for each environment)
Show/hide default values
