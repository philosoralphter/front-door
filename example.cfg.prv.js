//Use this file to set the phone numbers you want to call on twillio, and the four digit access code you want to set to allow access.
//also for setting the code to let people in, and the number of digits in the access code


module.exports = {
    CALL_NUMS: [], //list phone number strings in xxxxxxxxxx, xxx-xxx-xxxx, or E111 format

    ACCESS_CODE: '1234',
    ACCESS_CDOE_DIGITS: 4 //code is checked immediately after N digits entered
};
