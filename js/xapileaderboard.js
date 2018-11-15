function showLeaderBoard(){

  scores = ADL.XAPIWrapper.getStatements({"verb":"http://adlnet.gov/expapi/verbs/completed"})
  
  highScores = [];
  
  for(i=0; i < scores.statements.length; i++){
    highScores.push([scores.statements[i].result.score.raw, scores.statements[i].actor.name]);
  }
  
  highScores = highScores.sort().reverse();  
  
  table = document.getElementsByClassName('container__table-high-score-body')[0];
  
  for(i=0; i < 11; i++){
	var newRow = table.insertRow(-1);
	var newCell = newRow.insertCell(0);
	var newCell2 = newRow.insertCell(1);
	var newText = document.createTextNode(highScores[i][1]);
	var newText2 = document.createTextNode(highScores[i][0]);
	newCell.appendChild(newText);
	newCell2.appendChild(newText2);
  }  
  
  
}