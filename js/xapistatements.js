var conf = {
  "endpoint": "https://cloud.scorm.com/lrs/F583XZFRS8/sandbox/",
  "auth": "Basic " + toBase64("yJV2TEVZl38wzLDxXhw:AzvPZYLo3LsYe5O2UEc")
};

ADL.XAPIWrapper.changeConfig(conf);

function xAPIlaunched(parentName) {
  //define the xapi statement being sent  
  var statement = {
    "actor": {
      "mbox": "mailto:24hoursofbaby@" + parentName.split(" ").join("") + ".com",
      "name": parentName,
      "objectType": "Agent"
    },
    "verb": {
      "id": "http://adlnet.gov/expapi/verbs/launched",
      "display": {
        "en-US": "launched"
      }
    },
    "object": {
      "id": "http://24hoursofbaby.com/xapi/",
      "definition": {
        "name": {
          "en-US": "24 Hours of Baby"
        },
        "description": {
          "en-US": "Newborn baby game"
        }
      },
      "objectType": "Activity"
    }
  }; //end statement definition  

  // Dispatch the statement to the LRS  
  var result = ADL.XAPIWrapper.sendStatement(statement);
}

function xAPIcompleted(parentName, rawScore) {
  //define the xapi statement being sent  
  var statement = {
    "actor": {
      "mbox": "mailto:24hoursofbaby@" + parentName.split(" ").join("") + ".com",
      "name": parentName,
      "objectType": "Agent"
    },

    "verb": {
      "id": "http://adlnet.gov/expapi/verbs/completed",
      "display": {
        "en-US": "completed"
      }
    },
    "object": {
      "id": "http://24hoursofbaby.com/xapi/",
      "definition": {
        "name": {
          "en-US": "24 Hours of Baby"
        },
        "description": {
          "en-US": "Newborn baby game"
        }
      },
      "objectType": "Activity"
    },
    "result": {
      "score": {
        "raw": rawScore
      },
      "completion": true
    }

  }; //end statement definition

  // Dispatch the statement to the LRS  
  var result = ADL.XAPIWrapper.sendStatement(statement);
}

