wilson-demo-app
======

#Summary
This is a simple application to demostrate the how to setup and run a Wilson app.

#Run the app
There is a grunt "server" task to install dependencies and run the application.

```
grunt server
```

This is the default task so you can also just run:

```
grunt
```

See the Gruntfile.js for more info.

#Understanding
The server code is located in `app/server/app.js`

The client side angular app is located in `app/client/app.js`

App specific Wilson configuration is located in `app/server/config/wilson-config.json`

App routing is located in `app/client/routing.json`

App specific tag middleware is located in `app/server/tag-middleware`