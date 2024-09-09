const apiKey = process.env.BIG_CHANGE_API_KEY;
const apiAuth = process.env.BIG_CHANGE_API_BASIC_AUTH;
const authInfo = `Basic ${apiAuth}`;
const BIGCHANGE_BASE_API = `https://webservice.bigchangeapps.com/v01/services.ashx?key=${apiKey}`;

export const handler = async (event, context) => {
  const params = event.queryStringParameters;
  const phoneNumber = params.phone; // Remplacer 'param1' par le nom de votre paramètre
  const postCode = params.postCode;
  const formattedPhoneNumber = replacePlusWithEncodedPlus(phoneNumber);
  const clientId = await getContactIdFromPhoneAndPostCode(
    formattedPhoneNumber,
    postCode
  );

  const responseForJobs = await getJobListFromContactId(clientId);

  return {
    statusCode: 200,
    body: JSON.stringify({ responseForJobs, clientId }),
  };
};

function replacePlusWithEncodedPlus(inputString) {
  return inputString.replace(/\+/g, "%2B");
}

const getContactIdFromPhoneAndPostCode = async (phone, postCode) => {
  const CONTACTS_BY_PHONE_METHOD = "&action=ContactsByPhone";

  const apiUrlForContactsByPhone = `${BIGCHANGE_BASE_API}${CONTACTS_BY_PHONE_METHOD}&phonenumber=${phone}`;

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

  console.log("FUNCTION //////// postCode: " + postCode);

  //TODO ajouter la gestion du fait qu'avoir plusieurs résultats doit stopper le processus

  return data[0].ContactId;
};

const getSkills = async () => {
  const SKILLS_METHOD = "&action=Attributes&AttributeType=1";
  const skillsUrl = `${BIGCHANGE_BASE_API}${SKILLS_METHOD}`;
  return await fetch(skillsUrl, {
    method: "GET",
    headers: {
      Authorization: authInfo,
    },
  }).then((responseForJobs) => responseForJobs.json());
};

const getSillIdFromName = async (skillName) => {
  const skills = await getSkills();
  if (skills !== null) {
    const skill = skills.Result.filter((attribute) => attribute.AttributeName === skillName);
    if(skill !== null)
    {
      return skill.AttributeId;
    }
  }

  //TODO Handle ERRORS
  return null;
};

const getJobListFromContactId = async (clientId) => {
  //TODO remplacer les dates de début et de fin
  const JOBSLIST_METHOD =
    "&action=JobsList&Start=2024-01-01&End=2024-12-12";
  const apiUrlForJobList = `${BIGCHANGE_BASE_API}${JOBSLIST_METHOD}&contactId=${clientId}`;
  const responseForJobs = await fetch(apiUrlForJobList, {
    method: "GET",
    headers: {
      Authorization: authInfo,
    },
  }).then((responseForJobs) => responseForJobs.json());

  return responseForJobs;
};
