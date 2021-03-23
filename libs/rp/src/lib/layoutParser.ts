
// I decided to switch to RegExp instead of using raw search in the string
// We can also use an existing templating language or create our own using RegExp

const text =
  "##########################\n" +
  "#                        #\n"+
  "# +t[ Rumble Player -t]  #\n"+
  "#                        #\n"+
  "# [play] [pause] [stop]  #\n"+
  "#                        #\n"+
  "#                        #\n"+
  "#                        #\n"+
  "#                        #\n"+
  "##########################\n"


function getLines(text: string): string[] | void {
  const lines = text.split('\n');
  if(!checkValidity(lines)){
    throw Error('Invalid layout file')
  } else {
    return lines
  }

}
function checkValidity(arr: string[]):boolean {
  if (arr.length < 1){
    return false
  }
  const firstLineLength = arr[0].length
  for ( let i=1; i<arr.length;i++){
    if (arr[i].length != firstLineLength){
      return false
    }
  }
  return true
}
function getTitle(arr : string[]): string | boolean{
  for ( let i=0; i<arr.length; i++ ){
    if (arr[i].includes('+t[') && arr[i].includes('-t]')){
      // It would be better to use string.search(exp: RegExp)
      const titleRow = arr[i];
      const begin = titleRow.indexOf('+t[') +3
      const end = titleRow.indexOf('-t]')
      return titleRow.slice(begin,end)
    }
  }
  return false
}
