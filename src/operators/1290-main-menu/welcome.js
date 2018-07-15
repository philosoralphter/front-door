const VoiceResponse = require('twilio').twiml.VoiceResponse;


module.exports = function () {
    let response = new VoiceResponse();

    response.pause('2');

    response.say('Welcome to fog set Tower.');

    response.play('./assets/foghorn.mp3');

    response.say('Access Cannot be granted at this time via unit 3 0 4. Goodbye.');

    return response.toString();
};
