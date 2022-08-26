'use strict'
const xsenv = require('@sap/xsenv')

function getConfig () {
    var config = {}
    if (process.env.VCAP_SERVICES) {
        config = {
            connectionString: xsenv.cfServiceCredentials('20220808_test_postgre').uri,
            ssl: { rejectUnauthorized: false }
        }
    } else {
        console.log('running locally is not supported')
    }
    return config;
}

function getDB (cb) {
    let pgp = require('pg-promise')({
        // Initialization Options
    })
    var db = pgp(getConfig())
    let sql = `SELECT id FROM products WHERE id = 1;`
    db.query(sql)
    .then((result) => {
        console.log('database initialized', result)
        cb(null, db)
        return
    })
    .catch((err) => {
        console.log(err)
        cb(err, null)
        return
    })
}

module.exports  = {
    getDB: getDB
}