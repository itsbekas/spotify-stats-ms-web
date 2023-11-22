import Ajv2020 from "ajv/dist/2020";
const ajv = new Ajv2020({ allErrors: true, verbose: true, removeAdditional: true });

export function jsonIsValid(json: File, schema: File) {
    
    var reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = function () {
            try {
              const parsedData = JSON.parse(reader.result as string);
              const result = ajv.validate(schema, parsedData);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          };
        reader.readAsText(json);
    });
}

export function cleanJson(json: File): File {

    // TODO: remove any fields that are not needed
    var clean_json = json;

    return clean_json;
}
