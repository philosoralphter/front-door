# front-door
A server in a docker on my Kube cloud to answer Twilio calls from my building callbox.

# Customization
For base functionality, just rename the example.cfg.prv.js file to cfg.prv.js and enter the phone numbers to be called when the guest tries to connect to tennant. Also set an access code to automate entry to building.


# Fallback
In case your server goes down, you can host a static twiML file on S3 or wherever, and twilio will use that if your app cannot be reached.  This is useful to make sure that if somethign goes wrong, you'll still get the call on yoru cell phone.  Just edit the file to contain your phone number, add the file to your S3, and add the link to the file in your fallback url for your twilo app.  make sure it is set to use GEWT rather than POST as POST is not answered by S3 for retrieving a file.  Also make sure permissions on file are public, etc.


# Common Issues
