var conf = {
  "endpoint": "https://trial-lrs.yetanalytics.io/xapi/",
  "auth": "Basic " + toBase64("495dd7fd0d382fc953a7395934c1fb9c:b35ced3cfc78a45da2ca50f1a090e958")
};

  ADL.XAPIWrapper.changeConfig(conf);

function xAPIlaunched() {
  //define the xapi statement being sent  
  var statement = {
    "actor": {
      "mbox": "mailto:24hoursofbaby@user.com",
      "name": "Your Name Here",
      "objectType": "Agent"
    },
    "verb": {
      "id": "http://example.com/xapi/launched",
      "display": {
        "en-US": "launched"
      }
    },
    "object": {
      "id": "http://24hoursofbaby.com",
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