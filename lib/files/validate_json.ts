import Ajv2020 from "ajv/dist/2020";

import * as schema_validate_history from "@/lib/files/schemas/schema_history_full.json";
import * as schema_clean_history from "@/lib/files/schemas/schema_history.json";

export const CLEAN = "clean_";
export const VALIDATE = "validate_";
export const HISTORY = "history";

const ajv = new Ajv2020({ allErrors: true, verbose: true, removeAdditional: true });
ajv.addSchema(schema_validate_history, VALIDATE + HISTORY);
ajv.addSchema(schema_clean_history, CLEAN + HISTORY);

export function jsonIsValid(json: File, schema: string) {
    
    var reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = function () {
            try {
              const parsedData = JSON.parse(reader.result as string);
              const validate = ajv.getSchema(VALIDATE + schema)!;
              const result = validate(parsedData);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          };
        reader.readAsText(json);
    });
}

export function cleanJson(json: File, schema: string) {

    var reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = function () {
            try {
              const parsedData = JSON.parse(reader.result as string);
              const validate = ajv.getSchema(CLEAN + schema)!;
              const result = validate(parsedData);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          };
        reader.readAsText(json);
    });

}
