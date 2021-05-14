const logger = require('pino')({ prettyPrint: { colorize: true } });
const { Pool } = require('pg');
const jsforce = require('jsforce');


const connectionString = process.env.HEROKU_POSTGRESQL_OLIVE_URL;

const client = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

/*
WARNING: This demo uses for simplifcation username/password authentication.

For a real-live implementation you should use the JWT Bearer Flow.
*/

// const SF_USERNAME = process.env.SF_USERNAME;
// const SF_PASSWORD = process.env.SF_PASSWORD;
// const SF_LOGIN_URL = process.env.SF_LOGIN_URL;

// const conn = new jsforce.Connection({
//     loginUrl: SF_LOGIN_URL
// });

// // eslint-disable-next-line no-unused-vars
// conn.login(SF_USERNAME, SF_PASSWORD, (err, res) => {
//     if (err) {
//         logger.error(err);
//     }
// });

// const channel = "/event/CaseUpdated__e";
// const replayId = -2; // -2 is all retained events

// const fayeClient = conn.streaming.createClient([
//     new jsforce.StreamingExtension.Replay(channel, replayId),
//     new jsforce.StreamingExtension.AuthFailure(() => process.exit(1))
//   ]);
  
//   // Subscribe to the channel with a function to receive each message.
//   const subscription = fayeClient.subscribe(channel, data => {
//     console.log('CASE UPDATED received data!!', JSON.stringify(data));
//   });
  
//   // Eventually, close the connection.
//   subscription.cancel();

async function createCase(req, res, next) {
    //
    // INSERT into salesforce.case(subject, accountid, contactphone, status, casenumber, contactemail, description)
    // VALUES ('subject test', '0015e000004udQPAAY', '4154777777', 'closed', '10000000', 'echen22@salesforce.com', 'this is a description of my blown up tire');
    console.log(req.body);
    try {
        const accountId = '0015e000004udQPAAY'
        const testSubject = `${accountId} new case for: ${req.body.lead['range']}`
        await client.query(
            'INSERT into salesforce.case(subject, accountid, priority, contactphone, status, contactemail, description) VALUES($1,$2,$3,$4,$5,$6,$7)',
            [
                testSubject,
                accountId,
                req.body.lead['priority'],
                req.body.lead['contactPhone'],
                req.body.lead['status'],
                req.body.lead['contactemail'],
                req.body.lead['description']
            ]
        );
        req.log.info(`Case created`);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}

function caseChanged(req, res, next) {
    console.log("~~~~~~~~~~~PRINTING THE REQUEST BODY~~~~~~~~~~~")
    console.log(req.body)
    res.sendStatus(200);
    // body: {"new_status": "Working"}
}

module.exports = {
    createCase,
    caseChanged
};
