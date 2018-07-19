const _ = require('lodash');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const ENV_VARS = require('../../../cfg.prv.js');

const ACCESS_CODE = ENV_VARS.ACCCESS_CODE;
const ACCESS_CODE_DIGITS = Math.max(ENV_VARS.ACCCESS_CODE.DIGITS, 4);
const CALL_NUMS = ENV_VARS.CALL_NUMS;
const OPEN_DOOR_DIAL = ENV_VARS.OPEN_DOOR_DIAL;

const EASTER_EGGS = require('../../../easter-eggs.prv');

if (_.isUndefined(ACCESS_CODE)) {
    console.warn('Warning: No ACCESS_CODE set');
}

if (_.isEmpty(CALL_NUMS)) {
    console.warn('Warning: No CALL_NUMS set.');
}

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
                numDigits: ACCESS_CODE_DIGITS,
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
        else if (body.Digits in Object.keys(EASTER_EGGS)) {
            return EASTER_EGGS[body.Digits];
        } else {
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
        response.play({digits: OPEN_DOOR_DIAL});

        return response.toString();
    },

    //UNUSED
    noResponse: function () {
        const response = new VoiceResponse();
        response.say('No response received.  Goodbye.');
        response.hangup();
        return response.toString();
    }
};

