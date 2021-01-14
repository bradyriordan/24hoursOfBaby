function showLeaderBoard(parentName, rawScore) {

  document.getElementsByClassName('container__game-over-text-span')[0].innerHTML = parentName;

  scores = ADL.XAPIWrapper.getStatements({ "verb": "http://adlnet.gov/expapi/verbs/completed" })

  let highScores = [];
  
  scores.statements.map((element, i) => {
    let date = new Date(element.timestamp).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})
    highScores.push([element.result.score.raw, element.actor.name, date]);    
  })
  
  const sortedHighScores = highScores.slice().sort((a,b) => {
    if (a[0] === b[0]) { return 0 }
    if (a[0] < b[0]) { return -1 }
    if (b[0] < a[0]) { return 1 } 
  }).reverse();

  table = document.getElementsByClassName('container__table-high-score-body')[0];

  for (i = 0; i < 11; i++) {
    var newRow = table.insertRow(-1);
    var newCell = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newText = document.createTextNode(sortedHighScores[i][2]);
    var newText2 = document.createTextNode(sortedHighScores[i][1]);
    var newText3 = document.createTextNode(sortedHighScores[i][0]);
    newCell.appendChild(newText);
    newCell2.appendChild(newText2);
    newCell3.appendChild(newText3);
  }


}