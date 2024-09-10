const apiKey = process.env.BIG_CHANGE_API_KEY;
const apiAuth = process.env.BIG_CHANGE_API_BASIC_AUTH;
const authInfo = `Basic ${apiAuth}`;
const BIGCHANGE_BASE_API = `https://webservice.bigchangeapps.com/v01/services.ashx?key=${apiKey}`;

export const handler = async (event, context) => {
  const params = event.queryStringParameters;
  const skillType = params.skillType;
  const latitude = params.latitude;
  const longitude = params.longitude;
  const jobId = params.jobId;

  const skillId = await getSillIdFromName(skillType);
  const scheduleJob = await scheduleJobs(skillId, latitude, longitude, jobId);

  return {
    statusCode: 200,
    body: JSON.stringify({ scheduleJob }),
  };
};

const scheduleJobs = async (skillId, latitude, longitude, jobId) => {
  const SCHEDULEJOB_METHOD = "&action=JobSchedulingAssistant&schedulingType=1";
  //On set un délai d'une semaine pour planifier le RDV
  const startDate = getCurrentDateWithOffset(1);
  const endDate = getCurrentDateWithOffset(8);
  const apiUrlForScheduling = `${BIGCHANGE_BASE_API}${SCHEDULEJOB_METHOD}&fromDate=${startDate}&toDate=${endDate}&latitude=${latitude}&longitude=${longitude}&jobId=${jobId}&skills=${skillId}`;

  const rdvForJob = await fetch(apiUrlForScheduling, {
    method: "GET",
    headers: {
      Authorization: authInfo,
    },
  }).then((response) => response.json());

  console.log(
    "FUNCTION SCHEDULE //////// response:" + JSON.stringify(rdvForJob)
  );

  return rdvForJob;
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
    const skill = skills.Result.filter(
      (attribute) => attribute.AttributeName === skillName
    );
    if (skill !== null) {
      return skill[0].AttributeId;
    }
  }

  //TODO Handle ERRORS
  return null;
};

function getCurrentDateWithOffset(offsetDays) {
  const today = new Date();
  today.setDate(today.getDate() + offsetDays);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
