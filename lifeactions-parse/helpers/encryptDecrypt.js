const crypto = require('crypto');
const pbkdf2Hmac = require('pbkdf2-hmac')

const encrypt = async() => {
    let text = "^text:Mixer Grin"
    var key = await pbkdf2Hmac('my_super_secret_key_ho_ho_ho', 'ssshhhhhhhhhhh!!!!', 65536, 32, 'SHA-256');
    let buff = Buffer.from(key)
    const iv = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
    // Creating Cipheriv with its parameter
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(buff), iv);
    // Updating text
    let encrypted = cipher.update(text);
    
    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Returning iv and encrypted data
    console.log(encrypted.toString('base64'));
}

const decryptStr = async(text) => {
    try {
        if (!text || text == '') {
            return ''
        }
        // let text = Buffer.from('gfqTgGhyMJfykc+gR8MqOQ==')
        // let text = 'KzpwdvDJMbhmZTDbZ/q99Q=='
        var key = await pbkdf2Hmac('my_super_secret_key_ho_ho_ho', 'ssshhhhhhhhhhh!!!!', 65536, 32, 'SHA-256');
        let buff = Buffer.from(key)
        const iv = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
        let dec = crypto.createDecipheriv('aes-256-cbc', Buffer.from(buff), iv);
        let decrypted = dec.update(text, "base64", "utf8");
        decrypted += dec.final("utf8");
        return decrypted.toString()
    } catch (err) {
        console.log("decryption error: ", text, err.message)
        return ''
    }
}

module.exports = {
    decryptStr,
    encrypt
}