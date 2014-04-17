# azkvs 
## Overview

azkvs is a simple key-value store backed by Windows Azure Table Storage

This project provides a Node.js package consisting of a simple wrapper around the [Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node) that implements an abstraction around Tables to provide a partitioned key-value store.

This package was developed by [Rick Hallihan](http://rickhallihan.com) as an excercise in learning Node.js.  If you find it interesating or useful, I'd love to hear from you. I do not currently have any plans to update or maintain the module on a regular schedule. You are welcome to use it as-is, or fork it for your own purposes under the terms of the Apache 2.0 License, included in LICENSE.TXT.

# Features

* azkvs
    * new
    * getEntityBag
* EntityBag
	* addValue
	* getValue
	* getValues
	* removeValue

# Getting Started

## Install from npm

```
npm install azkvs
```

## Usage

First require azkvs to get the top-level interface, then call .getEntityBag with a simple name.

```Javascript
var azkvs = require('azkvs');
var data = azkvs.getEntityBag('Data');
```

On the back-end we are calling createTableIfNotExists and getting a reference to the new/existing table.

Next we can add some values. Each addValue requires a partition, key, and value.

```Javascript
data.addValue('entries','1','Test Value 1');
data.addValue('entries','2','Test Value 2');
data.addValue('entries','3','Test Value 3');
```

We can then retrieve the values we inserted above with .getValue:
```Javascript
data.getValue('entries',1,function(err,val){console.log('entry_1: '+ val);});
data.getValue('entries',2,function(err,val){console.log('entry_2: '+ val);});
data.getValue('entries','frog',function(err,val){console.log('entry_frog: '+ val);});
```

Lastly, we can retrieve multiple entries from the same partition with .getValues:
```Javascript
data.getValues('entries',1,9,function(err,val){console.log('entries_1_to_9: '+ JSON.stringify(val));});
data.getValues('entries',null,null,function(err,val){console.log('entries_no_filter: '+ JSON.stringify(val));});
```
