const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
var svc = new Service({
  name:'FashionScraper',
  description: 'Web scraper for e-commerce websites.',
  script: path.resolve(__dirname, 'server.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();