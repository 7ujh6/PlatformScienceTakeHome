# PlatformScienceTakeHome
This is a Node app that uses ExpressJS under the hood. The application will take as input two files: `<destinationsFileName.txt>` `<driverFileName.txt>` and it will process the data in those files and serve the maximized matchings between drivers and destinations back to the user.

# How To Run Program
To run the program, cd into the project directory and run `npm install && npm run start <destinationsFileName.txt>  <driverFileName.txt>` or simply run `npm install && npm run start`. In the latter case (assuming the assets have been properly copied over) the program with use the default assets instead of the command line args. The server will start running on `localhost: 3000`. Once the server is up and running, navigate to the endpoint `/maximize` and the algorithm will start running. The result will be served on that endpoint as a JSON response.
