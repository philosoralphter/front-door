const VoiceResponse = require('twilio').twiml.VoiceResponse;


const ACCESS_CODE = '4802';
const CALL_NUMS = require('../../../cfg.prv').ringThese;



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
        gather.play('./assets/tos_bosun_whistle_1.mp3');
        gather.say('Welcome to fog set tower.  Press 1 to call the tenant.  Press 2 if you have an access code.');

        //if no input
        response.redirect({
            method: 'POST'
        }, '/welcome');


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
                timeout: 8,
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
        const dial = response.dial({
            timeout: 15,
            timeLimit: 60
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
            return this.beamUp();
        } else if (body.Digits === '69'){
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
    }
};


let easterEggs = {
    kayron: () => {
        const response = new VoiceResponse();
        response.say('Is that you, Kayron?');
        response.hangup();
    },

    beamUp: () => {
        let response = new VoiceResponse();

        response.pause('2');

        response.say('Standby for transport.');

        response.play('./assets/tng_transporter6_clean.mp3');

        return response.toString();
    }
};
