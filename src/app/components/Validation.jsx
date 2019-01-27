

export function ShebaValidation(str) {
  const iso7064Mod97_10 = (iban) => {
    var remainder = iban,
      block;

    while (remainder.length > 2) {
      block = remainder.slice(0, 9);
      remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
    }

    return parseInt(remainder, 10) % 97;
  }
  var pattern = /IR[0-9]{24}/;
  if (str.length !== 26) {
    return false;
  }

  if (!pattern.test(str)) {
    return false;
  }

  var newStr = str.substr(4);
  var d1 = str.charCodeAt(0) - 65 + 10;
  var d2 = str.charCodeAt(1) - 65 + 10;
  newStr += d1.toString() + d2.toString() + str.substr(2, 2);

  var remainder = iso7064Mod97_10(newStr);
  if (remainder !== 1) {
    return false;
  }

  return true;

}
export function TextAreaWordLimit(value, limitCount) {

  var str = value
  //exclude  start and end white-space
  str = str.replace(/(^\s*)|(\s*$)/gi, '');
  //convert 2 or more spaces to 1  
  str = str.replace(/[ ]{2,}/gi, ' ');
  // exclude newline with a start spacing  
  str = str.replace(/\n /, '\n');
  var strlength = str.split(' ').length
  if (strlength > limitCount) {
    return false
  } else {
    return true
  }
}