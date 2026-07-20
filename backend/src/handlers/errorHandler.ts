//import fs from 'node:fs';

// @ts-ignore
function getErrors(error: unknown) : {name : string, stack? : string, message: string} {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return {
    name: "UnknownError", message: String(error),
  };
}
