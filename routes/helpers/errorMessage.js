export const getSanitizedErrorMessage = async (httpResponse) => {
    const {
        httpStatus,
        httpStatusCode,
        message,
        response
    } = httpResponse;
    const importSummaries = response.importSummaries || [{
        description: ""
    }]
    let sanitizedMessage = httpStatus ? `httpStatus : ${httpStatus}\n` : ``;
    sanitizedMessage += httpStatusCode ? `httpStatusCode : ${httpStatusCode}\n` : ``;
    sanitizedMessage += message ? `${message}\n` : `Error occurs on sending data`;
    sanitizedMessage += importSummaries[0].description !== '' ? `${importSummaries[0].description}\n` : ``;
    return sanitizedMessage;
}