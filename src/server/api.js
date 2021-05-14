const logger = require('pino')({ prettyPrint: { colorize: true } });
const { Pool } = require('pg');

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
async function createCase(req, res, next) {
    //
    // INSERT into salesforce.case(subject, accountid, contactphone, status, casenumber, contactemail, description)
    // VALUES ('subject test', '0015e000004udQPAAY', '4154777777', 'closed', '10000000', 'echen22@salesforce.com', 'this is a description of my blown up tire');
    console.log(req.body);
    try {
        const accountId = '0015e000004udQPAAY'
        await client.query(
            'INSERT into salesforce.case(subject, accountid, priority, contactphone, status, contactemail, description) VALUES($1,$2,$3,$4,$5,$6,$7)',
            [
                "test subject",
                accountId,
                req.body.lead['priority'],
                req.body.lead['contactphone'],
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

module.exports = {
    createCase,
};
