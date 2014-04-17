//-----------------------------------------------------------
// Class Definition
//-----------------------------------------------------------

/*
 * Required:
 */

var azure = require('azure');
 
/*
 * The Interface for interacting with an EntityBag
 */

function EntityBag(name, tableservice, callback) {
    this.IsReady=false;
    this.TableService = tableservice
    this.BagName = name;
    this.LastError = undefined;
   
    tableservice.createTableIfNotExists(name, EntityBagTableCallback.bind(this,callback)); 

    function EntityBagTableCallback(err)
    {
        if(err)
        {
            this.LastError=err;
            if(callback) {callback(err);}
        }
        else
        {
            this.IsReady=true;
            if(callback) {callback(err);}
        }    
    }
}
var p = EntityBag.prototype
 
//-----------------------------------------------------------
// Private Methods
//-----------------------------------------------------------

function SortableNormalize(val, forcejson)
{
    forcejson = forcejson || false;
    if(typeof(val)!=='string' || forcejson ) {return JSON.stringify(val);}
    return val;
}

//-----------------------------------------------------------
// Public Methods
//-----------------------------------------------------------
 
p.addValue = function AddValue(partition,key,value,callback)
{
        var Entity={
            PartitionKey : SortableNormalize(partition)
            , RowKey : SortableNormalize(key)
            , value : SortableNormalize(value,true)};
        this.TableService.insertOrReplaceEntity(this.BagName, Entity, AddValueCallback.bind(callback)); 
        function AddValueCallback(err,val)
        {
            if(callback) { callback(err,val);}
            else{ console.warn("WARN: EntityBag.addValue called without callback");}
        } 
}


p.getValue = function GetValue(partition,key,callback)
{
    this.TableService.queryEntity(this.BagName, SortableNormalize(partition), SortableNormalize(key), GetValueCallback.bind(callback));    
    function GetValueCallback(err,val)
    {
        if(callback) { 
            if(err) {callback(err);} 
            else {callback(err,JSON.parse(val.value));};
        }
        else{ console.warn("WARN: EntityBag.getValue called without callback, this default callback is a bridge to nowhere.");}
    } 

}

p.removeValue = function RemoveValue(partition,key,callback)
{
    var test = SortableNormalize(key);
    this.TableService.deleteEntity(this.BagName, {PartitionKey:SortableNormalize(partition), RowKey:SortableNormalize(key)}, RemoveValueCallback.bind(callback));    
    function RemoveValueCallback(err)
    {
        if(callback) { 
            callback(err);
        }
        else{ console.warn("WARN: EntityBag.removeValue called without callback.");}
    } 
}


p.getValues = function GetValues(partition, keystart, keyend, callback)
{
    var query = azure.TableQuery
    .select()
    .from(this.BagName)
    .where('PartitionKey eq ?', SortableNormalize(partition));
    if (keystart) { query.and('RowKey ge ?', SortableNormalize(keystart)); }
    if (keyend) { query.and('RowKey le ?', SortableNormalize(keyend)); }
    this.TableService.queryEntities(query,GetValuesCallback.bind(callback));
    function GetValuesCallback(err,val)
    {
        if (callback) {
            var values = {}; 
            if (!err && val) { val.forEach(function (entry) { values[entry.RowKey] = entry.value; }.bind(values)); }
            callback(err,values);
        }
        else{ console.error("ERROR: EntityBag.getValues called without callback, this default callback is a bridge to nowhere.");}
    } 
}



//-----------------------------------------------------------
// Exports - Class Constructor
//-----------------------------------------------------------
 
module.exports = EntityBag;
