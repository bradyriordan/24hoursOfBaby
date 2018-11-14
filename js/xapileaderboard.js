function showLeaderBoard(){

  scores = ADL.XAPIWrapper.getStatements({"verb":"http://adlnet.gov/expapi/verbs/completed"})
  
  highScores = [];
  
  for(i=0; i < scores.statements.length; i++){
    highScores.push([scores.statements[i].result.score.raw, scores.statements[i].actor.name]);
  }
  
  highScores = highScores.sort();
  
}