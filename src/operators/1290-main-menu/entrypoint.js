
const _ = require('lodash');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const ENV_VARS = require('../../../cfg.prv');

const ACCESS_CODE = ENV_VARS.ACCCESS_CODE;
const CALL_NUMS = ENV_VARS.ringThese;



module.exports = {
    main: function () {
        const response = new VoiceResponse();
        const gather = response.gather({
            input: 'dtmf',
            numDigits: 1,
            timeout: 7,
            action: '/handle-input',
            method: 'POST'
        });

        // response.pause('2');
        gather.play('./assets/tos_bosun_whistle_1_trimmed_lo_vol.mp3');
        gather.say('Welcome to fog-set, tower.  Press 1, or hold, to call the tenant.  Press 2 if you have an access code.');

        //if no input
        response.redirect({
            method: 'POST'
        }, '/dial-tenant');


        return response.toString();
    },

    handleInput: function (body) {
        const response = new VoiceResponse();

        if (body.Digits === '1' ) {
            //Forward Call
            return this.dialTenant();
        } else if (body.Digits === '2') {
            //Accept code
            const gather = response.gather({
                input: 'dtmf',
                numDigits: 4,
                timeout: 4,
                action: '/check-code',
                method: 'POST'
            });

            gather.say('Enter your code.');


            return response.toString();
        } else {
            return this.error();
        }
    },

    dialTenant: function () {
        const response = new VoiceResponse();
        response.say('Calling Tenant.');


        const dial = response.dial({
            timeout: 15,
            timeLimit: 120
        });

        _.each(CALL_NUMS, (number) => {
            dial.number(number);
        });


        return response.toString();
    },

    checkCode: function (body) {

        if (body.Digits === ACCESS_CODE) {
            return this.accessGranted();
        }
        else if (body.Digits === '1701' ) {
            return easterEggs.beamUp();
        }else if (body.Digits === '1700' || body.Digits === '1702' ) {
            return easterEggs.beamUpFail();
        } else if (body.Digits === '69' || body.Digits === '6969'){
            return easterEggs.kayron();
        }else {
            return this.accessDenied();
        }
    },

    error: function () {
        const response = new VoiceResponse();

        response.say('System Error. Access Cannot be granted at this time via unit 3 0 4. Goodbye.');

        return response.toString();
    },

    accessDenied: function () {
        const response = new VoiceResponse();

        response.say('Access Denied');

        return response.toString();
    },

    accessGranted: function () {
        const response = new VoiceResponse();

        response.say('Access Granted');
        response.play({digits: 'ww9'});

        return response.toString();
    },

    //UNUSED
    noResponse: function () {
        const response = new VoiceResponse();
        response.say('No response received.  Goodbye.');

    }
};


let easterEggs = {
    kayron: () => {
        const response = new VoiceResponse();
        response.say('Is that you? Kay Ron?');
        response.hangup();
        return response.toString();
    },

    beamUp: () => {
        let response = new VoiceResponse();

        response.pause('1');

        response.say({voice: 'alice'}, 'Standby for transport.');

        response.play('./assets/tng_transporter6_clean.mp3');

        response.hangup();

        return response.toString();
    },

    beamUpFail: () => {
        let response = new VoiceResponse();

        response.pause('1');

        response.say({voice: 'alice'}, 'Standby for transport.');

        response.play('./assets/tng_transporter_materializationproblem.mp3');

        response.say({voice: 'alice'}, 'Transporter Malfunction.  You\'ll have to take the stairs.');

        response.hangup();

        return response.toString();
    }
};
