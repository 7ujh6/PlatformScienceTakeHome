const express = require('express');
const { processInput } = require('./Helpers/InputHelpers');
const { matchAndMaximize } = require('./matchAndMaximize');
const app = express();
const hostname = 'localhost';
const port = 3000;

app.get('/', (_, response) => {
    response.send('<h1>Application Home</h1>');
});

app.get('/maximize', (_, response) => {
    const {driverArray, destinationArray, evenDestinationArray, oddDestinationArray} = processInput(); // recieve and destructure the processed input
    const maxShipmentMatchingResult = matchAndMaximize(driverArray, destinationArray, evenDestinationArray, oddDestinationArray); // get the max suitability score from that input
    if (Object.keys(maxShipmentMatchingResult).length == 3) {
        response.json(maxShipmentMatchingResult); // server json response on the /maximize endpoint
    } else {
        response.send('<h1>Please Submit Valid Input...</h1>');
    }
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});