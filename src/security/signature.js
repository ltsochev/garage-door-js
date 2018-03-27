const crypto = require('crypto');

class Signature {
    constructor(secret, sigParam) {
        this.secret = secret;
        this.signatureParameter = sigParam || 'cid';
    }

    generate(paramObj) {
        // Sort params by key
        let k, i, hmac,
            keys = [],
            queryBuilder = [],
            queryString;

        for(k in paramObj) {
            if (paramObj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }

        // Now that we have a key array, we can sort it
        keys.sort(); // By default javascripts sorts alphabetically

        for(i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (key == this.signatureParameter) { continue; }

            queryBuilder.push(key + '=' + paramObj[key]);
        }

        // Concatenize and create hash from the resulted string
        queryString = queryBuilder.join('&');
        hmac = crypto.createHmac('sha1', this.secret);
        hmac.update(queryString);

        // Return the raw binary signature as base64 encoded string
        return Buffer.from(hmac.digest('binary')).toString('base64').trim();
    }

    validate(paramObj) {
        if (!paramObj.hasOwnProperty(this.signatureParameter)) { return false; }

        let signature = paramObj[this.signatureParameter];
        if ( this._isEmpty(signature) ) { return false; }

        let generatedSignature = this.generate(paramObj);

        return (generatedSignature === signature);
    }

    _isEmpty(str) {
        return (!str || 0 === str.length);
    }
}

module.exports = Signature;