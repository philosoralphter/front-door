const VoiceResponse = require('twilio').twiml.VoiceResponse;

module.exports = {
    '1701': function beamUp() {
        let response = new VoiceResponse();

        response.pause('1');

        response.say({voice: 'alice'}, 'Standby for transport.');

        response.play('./assets/tng_transporter6_clean.mp3');

        response.hangup();

        return response.toString();
    }
};
