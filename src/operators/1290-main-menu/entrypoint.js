const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const ENV_VARS = require('../../../config/cfg.prv.js');

//Load codes and phone numbers
const ACCESS_CODE = ENV_VARS.ACCESS_CODE;
const ACCESS_CODE_DIGITS = Math.max(ENV_VARS.ACCESS_CODE_DIGITS, 4);
const CALL_NUMS = ENV_VARS.CALL_NUMS;
const OPEN_DOOR_DIAL = ENV_VARS.OPEN_DOOR_DIAL;

//Load Easter Eggs
const easterEggFile = '../../../config/easter-eggs.prv.js';
const exampleEasterEggFile = '../../../config/example.easter-eggs.prv.js';
const EASTER_EGGS = fs.existsSync(path.join(__dirname, easterEggFile)) ? require(easterEggFile) : require(exampleEasterEggFile);

//load persons with personalized access codes
const PRIVATE_ACCESS = {};
_.each(ENV_VARS.PERSONAL_ACCESS, (person) => {
    PRIVATE_ACCESS[person.code] = new PersonalAccess(person.code, person.name, person.say);
});

//Check required vars
if (_.isUndefined(ACCESS_CODE)) {
    console.warn('Warning: No ACCESS_CODE set');
    console.log(ENV_VARS)
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
            timeout: 3,
            action: '/handle-input',
            method: 'POST'
        });

        response.pause(1);
        // gather.say('Welcome to fog-set, tower.  Press 1, or hold, to call the tenant.  Press 2 if you have an access code.');
        gather.say('Welcome to fog-set, tower.  To call the tenant, Press 1, or wait.  If you have an access code, press 2.');

        //if no input
        response.redirect({
            method: 'POST'
        }, '/dial-tenant');

        return response.toString();
    },

    handleInput: function (body) {

        if (body.Digits === '1' ) {
            //Forward Call
            return this.dialTenant();

        } else if (body.Digits === '2') {
            //Accept code
            const response = new VoiceResponse();
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
        else if (_.has(EASTER_EGGS, body.Digits)) {
            return EASTER_EGGS[body.Digits]();
        }
        else if (_.has(PRIVATE_ACCESS, body.Digits)) {
            return PRIVATE_ACCESS[body.Digits]();
        } else {
            return this.accessDenied();
        }
    },

    error: function () {
        const response = new VoiceResponse();

        response.say('System Error. Access Cannot be granted at this time via unit 3 0 4. Goodbye.');

        response.hangup();

        return response.toString();
    },

    accessDenied: function () {
        const response = new VoiceResponse();

        response.say('Access Denied');

        response.hangup();

        return response.toString();
    },

    accessGranted: function () {
        const response = new VoiceResponse();

        response.say('Access Granted');
        response.play({digits: OPEN_DOOR_DIAL});

        response.pause(1);
        response.hangup();


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


//Util
function PersonalAccess(code, name, say) {
    return function () {
        const response = new VoiceResponse();

        (function parseSay(say) {

            if (_.isArray(say)) {
                _.each(say, parseSay)

            } else if (_.isObject(say)) {
                response.say(say.settings, say.text)

            } else if (_.isString(say)) {
                response.say(say);
            } else if ( _.isNil(say)) {
                response.say('Welcome, ' + name);
                response.say({voice: 'alice'}, 'Access Granted');
            }

        })(say);


        response.play({digits: OPEN_DOOR_DIAL});

        response.pause(1);
        response.hangup();

        console.log({
            timestamp: Date.now(),
            code: code,
            name: name
        });

        return response.toString();
    }
}
