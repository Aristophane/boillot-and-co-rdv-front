const apiKey = process.env.BIG_CHANGE_API_KEY;
const apiAuth = process.env.BIG_CHANGE_API_BASIC_AUTH;
const authInfo = `Basic ${apiAuth}`;
const BIGCHANGE_BASE_API = `https://webservice.bigchangeapps.com/v01/services.ashx?key=${apiKey}`;

export const handler = async (event, context) => {
  const params = event.queryStringParameters;
  const phoneNumber = params.phone;
  const postCode = params.postCode;
  const formattedPhoneNumber = replacePlusWithEncodedPlus(phoneNumber);
  try {
    const clientId = await getContactIdFromPhoneAndPostCode(
      formattedPhoneNumber,
      postCode
    );

    console.log("THE CLIENT ID IS: " + clientId);

    if (clientId != null && clientId != undefined && typeof clientId === "number" && !isNaN(clientId)
    ) {
      const responseForJobs = await getJobListFromContactId(clientId);
      return {
        statusCode: 200,
        body: JSON.stringify({ responseForJobs, clientId }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Pas de client relié ou client en double",
          error: clientId?.message || "Erreur inconnue",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Une erreur est survenue",
        error: error?.message || "Erreur inconnue",
      }),
    };
  }
};

function replacePlusWithEncodedPlus(inputString) {
  return inputString.replace(/\+/g, "%2B");
}

const getContactIdFromPhoneAndPostCode = async (phone, postCode) => {
  const CONTACTS_BY_PHONE_METHOD = "&action=ContactsByPhone";

  const apiUrlForContactsByPhone = `${BIGCHANGE_BASE_API}${CONTACTS_BY_PHONE_METHOD}&phonenumber=${phone}`;

  try {
    const responseForContact = await fetch(apiUrlForContactsByPhone, {
      method: "GET",
      headers: {
        Authorization: authInfo,
      },
    }).then((response) => response.json());

    console.log("API called" + apiUrlForContactsByPhone);
    console.log(
      "FUNCTION //////// response:" + JSON.stringify(responseForContact)
    );
    const data = responseForContact?.Result.filter(
      (contact) => contact.ContactPostCode === postCode
    );

    if (data !== null && data !== undefined && data.length === 1) {
      return data[0].ContactId;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: data.length > 1 ? "Contact en double" : "Contact inconnu",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Une erreur est survenue",
        error: error?.message || "Erreur inconnue",
      }),
    };
  }
};

function formatDate(date) {
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2); // Mois avec un 0 devant si besoin
  let day = ("0" + date.getDate()).slice(-2); // Jour avec un 0 devant si besoin
  return `${year}-${month}-${day}`;
}

const getStartAndEndDate = () => {
  // Date actuelle
  let currentDate = new Date();

  let startDate = new Date();
  startDate.setMonth(currentDate.getMonth() - 3);

  let endDate = new Date();
  endDate.setMonth(currentDate.getMonth() + 8);

  let startString = formatDate(startDate);
  let endString = formatDate(endDate);

  return `Start=${startString}&End=${endString}`;
};

const getJobListFromContactId = async (clientId) => {
  const JOBSLIST_METHOD = `&action=JobsList&${getStartAndEndDate()}`;
  const apiUrlForJobList = `${BIGCHANGE_BASE_API}${JOBSLIST_METHOD}&contactId=${clientId}`;
  const responseForJobs = await fetch(apiUrlForJobList, {
    method: "GET",
    headers: {
      Authorization: authInfo,
    },
  }).then((responseForJobs) => responseForJobs.json());

  const resultJson = JSON.stringify(responseForJobs);
  if (
    resultJson == null ||
    resultJson == undefined ||
    resultJson.Result?.length == 0
  ) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `Pas de jobs pour le numéro de client ${clientId}`,
      }),
    };
  } else {
    return responseForJobs;
  }
};
