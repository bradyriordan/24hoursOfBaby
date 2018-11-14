var conf = {
  "endpoint": "https://trial-lrs.yetanalytics.io/xapi/",
  "auth": "Basic " + toBase64("495dd7fd0d382fc953a7395934c1fb9c:b35ced3cfc78a45da2ca50f1a090e958")
};

ADL.XAPIWrapper.changeConfig(conf);

function xAPIlaunched(parentName) {
  //define the xapi statement being sent  
  var statement = {
    "actor": {
      "mbox": "mailto:24hoursofbaby@user.com",
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
      "mbox": "mailto:24hoursofbaby@user.com",
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
	  "scaled": 1,
	  "min": 0,
	  "max": 100,
	  "raw": rawScore
	  },
	 "success": true,
	 "completion": true		
  }  
   
 }; //end statement definition
 
  // Dispatch the statement to the LRS  
  var result = ADL.XAPIWrapper.sendStatement(statement);
} 

