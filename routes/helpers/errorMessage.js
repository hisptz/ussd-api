export const getSanitizedErrorMessage = async httpResponse => {
  console.log('responce', httpResponse);

  let sanitizedMessage = '';

  const { httpStatus, httpStatusCode, status, message, response, conflicts, importCount } = httpResponse;
  let importSummaries = [
    {
      description: ''
    }
  ];
  if (response && response.importSummaries) {
    importSummaries = response.importSummaries;
  }
  if ((conflicts, importCount)) {
    // Object.keys(importCount).map(key => {
    //   importSummaries[0].description += `${key} ${importCount[key]}\n`;
    // });
    // conflicts.map(conflict => {
    //   const { object, value } = conflict;
    //   if (object && value) {
    //     importSummaries[0].description += `${object} : ${value}\n`;
    //   }
    // });
  }

  sanitizedMessage += httpResponse.status ? `${httpResponse.status}\n` : ``;
  sanitizedMessage += conflicts[0] ? `message: ${conflicts[0].value}\n` : ``;
  sanitizedMessage += importCount.imported > 0 ? `imported : ${importCount.imported}\n` : ``;
  sanitizedMessage += importCount.updated > 0 ? `updated : ${importCount.updated}\n` : ``;
  sanitizedMessage += importCount.ignored > 0 ? `ignored : ${importCount.ignored}\n` : ``;
  sanitizedMessage += importCount.deleted > 0 ? `deleted : ${importCount.deleted}\n` : ``;

  //   let sanitizedMessage = httpStatus ? `httpStatus : ${httpStatus}\n` : ``;
  //   sanitizedMessage += httpStatusCode ? `httpStatusCode : ${httpStatusCode}\n` : ``;
  //   sanitizedMessage += status ? `status : ${status}\n` : ``;
  //   sanitizedMessage += message ? `${message}\n` : ``;
  //   sanitizedMessage += importSummaries[0].description !== '' ? `${importSummaries[0].description}\n` : ``;

  return sanitizedMessage;
};
