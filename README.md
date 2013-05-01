ejs
===

Server and Client for EJS integration.

Installation
===

+ Install node.js [http://nodejs.org/](http://nodejs.org/). 
+ Build node packages: 

        npm install
        
+ Create a config.json file in the app root:

        {
          "serialPort" : "/dev/cu.usbserial", //Path to serial port
          "domain" : "ejs.app", //URL of client site
          "port" : 80 //Port of client site
        }

+ Connect usb-to-serial adapter
+ Run server app:

         sudo node main.js
         
+ Browse to http://ejs.app:80 (or the domain you specified)
    
