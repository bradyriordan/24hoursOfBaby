function showLeaderBoard(parentName, rawScore) {

  document.getElementsByClassName('container__game-over-text-span')[0].innerHTML = parentName;

  scores = ADL.XAPIWrapper.getStatements({ "verb": "http://adlnet.gov/expapi/verbs/completed" })

  highScores = [];

  for (i = 0; i < scores.statements.length; i++) {
    date = new Date(scores.statements[i].timestamp);    
    date = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    highScores.push([scores.statements[i].result.score.raw, scores.statements[i].actor.name, date]);
  }

  highScores = highScores.sort(sortFunction).reverse();

  function sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    }
    else {
      return (a[0] < b[0]) ? -1 : 1;
    }
  }

  table = document.getElementsByClassName('container__table-high-score-body')[0];

  for (i = 0; i < 11; i++) {
    var newRow = table.insertRow(-1);
    var newCell = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newText = document.createTextNode(highScores[i][2]);
    var newText2 = document.createTextNode(highScores[i][1]);
    var newText3 = document.createTextNode(highScores[i][0]);
    newCell.appendChild(newText);
    newCell2.appendChild(newText2);
    newCell3.appendChild(newText3);
  }


}