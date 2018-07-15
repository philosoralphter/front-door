const VoiceResponse = require('twilio').twiml.VoiceResponse;




module.exports = function () {
    let response = new VoiceResponse();

    response.pause('2');

    response.say({voice: 'alice'},'Welcome to fog-set Towers.');

    response.play('./assets/foghorn.mp3');

    response.say('Access Cannot be granted at this time via unit 3 0 4. Goodbye.');


    console.log('RESPONDING: ', response.toString());
    return response.toString();
};
