var sharp = "#";
var num = 110;


spacesLen=num/2;

do {
  var spaces="";
  do {
    spaces+=" ";
  } while (spaces.length<spacesLen);
  
  console.log(spaces + sharp);
  sharp+="##";
  spacesLen--;

} while (sharp.length<num);