/*
 * Load Settings
 */
nconf = require('nconf');
nconf.env().file({ file: 'settings.json' });

/*
 * Load Dependencies
 */
var azure = require('azure');
var EntityBag = require('../lib/entitybag');

/*
 * Initialize Table Interface
 */
var tableService = azure.createTableService(nconf.get('azkvs:storageaccount'), nconf.get('azkvs:storagekey'));

//-----------------------------------------------------------
// Public Methods
//-----------------------------------------------------------

exports.info = function info() {
    var message="This is a simple azure table wrapper to provide a key-value-pair utility backed by Azure Table Storage.";
    console.log(message);
    return(message);
}

exports.getEntityBag = function (name) {
  return new EntityBag(name, tableService );
};

