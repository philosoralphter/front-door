const VoiceResponse = require('twilio').twiml.VoiceResponse;

module.exports = {
    '1701': function beamUp() {
        let response = new VoiceResponse();

        response.pause('1');

        response.say({voice: 'alice'}, 'Standby for transport.');

        response.play('./assets/tng_transporter6_clean.mp3');

        response.hangup();

        return response.toString();
    },

    '1700': function beamUpFail() {
        let response = new VoiceResponse();

        response.pause('1');

        response.say({voice: 'alice'}, 'Standby for transport.');

        response.play('./assets/tng_transporter_materializationproblem.mp3');

        response.say({voice: 'alice'}, 'Transporter Malfunction.  You\'ll have to take the stairs.');

        response.hangup();

        return response.toString();
    },
    '1702': this['1700'],
};
