/**
 * JSON to XML Using Javascript: https://stackoverflow.com/questions/48788722/json-to-xml-using-javascript
 * @param obj 
 * @returns 
 */
export function objToXML(obj: any){
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += objToXML(new Object(obj[prop][array]));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += objToXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
}

/**
 * Javascript - removendo campos indefinidos de um objeto: https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
 */
export function removerAtributosIndefinidos(obj: any){
  let newObj:any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])){
      newObj[key] = removerAtributosIndefinidos(obj[key]);
    }else if (obj[key] !== undefined){
      newObj[key] = obj[key];
    }
  });
  return newObj;
}