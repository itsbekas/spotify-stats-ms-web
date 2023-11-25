import Ajv2020 from "ajv/dist/2020";

import * as schema_history from "@/lib/files/schemas/schema_history.json";

export const IMPORT = "history";

const ajv = new Ajv2020({ allErrors: true, verbose: true, removeAdditional: "all" });
ajv.addSchema(schema_history, IMPORT);

export function validateJson(json: File, schema: string): Promise<JSON | undefined> {
    
    var reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = function () {
            try {
              const parsedData: JSON = JSON.parse(reader.result as string);
              const validate = ajv.getSchema(schema)!;
              if (!validate(parsedData)) {
                reject(undefined);
              }
              resolve(parsedData);
            } catch (error) {
              reject(undefined);
            }
          };
        reader.readAsText(json);
    });
}
