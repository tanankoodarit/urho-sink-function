'use strict';

// [START build_service]
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();
// [END build_service]

function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

function now(){
    return createDateAsUTC(new Date());
}

function store(data) {

    const deviceKey = datastore.key('Devices');
    const entity = {
        key: deviceKey,
        data: data
    };

    datastore.save(entity)
        .then(() => {
            console.log(`Task ${deviceKey.id} created successfully.`);
        })
        .catch((err) => {
            console.error('ERROR:', err);
        });
}



/*
saunamittari
*/
function dev_37A657(id, data) {
    const temp = (parseInt(data.substring(0, 4), 16) / 10) - 40;
    const hum = parseInt(data.substring(4, 2), 16) / 10;
    const entityData = [{
        name: 'created',
        value: now()
    }, {
        name: 'id',
        value: id
    }, {
        name: 'temperature',
        value: temp,
        excludeFromIndexes: true
    }, {
        name: 'humidity',
        value: hum,
        excludeFromIndexes: true
    }];
    store(entityData);
}


function dev_button(id, data){
    const entityData = [{
        name: 'created',
        value: now()
    }, {
        name: 'id',
        value: id
    }, {
        name: 'data',
        value: data
    }];
    store(entityData);
}


function handle(id, data) {
    console.log("Id under handle:" + id.toUpperCase() + " data: " + data);
    switch (id.toUpperCase()) {
        case "37A657":
            dev_37A657(id, data);
            break;
        case "24BBB3":
            // Sauna liiketunnistin
            dev_button(id, data);
            break;
        case "24C550":
            // Savu/häkähälyytin
            dev_24C550(id, data);
            break;
        case "3696B7":
            // xkit
            dev_button(id, data);
            break;
        case "75B7D":
            // Bisse nappi 1
            dev_button(id, data);
            break;
        case "75C8D":
            // Bisse nappi 2
            dev_button(id, data);
            break;
        default:
            // statements_def
            break;
    }

}


exports.iotSink = function iotSink(req, res) {



    if (req.body && req.body.id) {
        handle(req.body.id, req.body.data);
        res.status(200).end();
    } else {
        console.log(req.body);
        res.status(500).end();
    }
};