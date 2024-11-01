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
  const slidingDate = params.slidingDate;

  const skillId = await getSkillIdFromName(skillType);
  const scheduleJob = await scheduleAssistantJobs(
    skillType,
    latitude,
    longitude,
    jobId,
    slidingDate
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ scheduleJob }),
  };
};

const scheduleAssistantJobs = async (
  skillType,
  latitude,
  longitude,
  jobId,
  slidingDate
) => {
  const SCHEDULE_JOB_ASSISTANT_METHOD =
    "&action=JobSchedulingAssistant&schedulingType=1";
  let creneauxDispos = false;
  let dayShift = parseInt(slidingDate, 10);
  let rdvForJob = null;
  while (!creneauxDispos) {
    //On set un délai d'une semaine pour planifier le RDV
    const startDate = getCurrentDateWithOffset(dayShift + 1);
    const endDate = getCurrentDateWithOffset(dayShift + 8);
    //TODO ATTENTION version sans skillId
    // const apiUrlForSchedulingAssistant = `${BIGCHANGE_BASE_API}${SCHEDULE_JOB_ASSISTANT_METHOD}&fromDate=${startDate}&toDate=${endDate}&latitude=${latitude}&longitude=${longitude}&jobId=${jobId}&skills=${skillId}`;
    let apiUrlForSchedulingAssistant = "";
    console.log("Faux skill type remonté: " + skillType);
    if (skillType != "Remplacement de BEC") {
      apiUrlForSchedulingAssistant = `${BIGCHANGE_BASE_API}${SCHEDULE_JOB_ASSISTANT_METHOD}&fromDate=${startDate}&toDate=${endDate}&latitude=${latitude}&longitude=${longitude}&jobId=${jobId}`;
    } else {
      apiUrlForSchedulingAssistant = `${BIGCHANGE_BASE_API}${SCHEDULE_JOB_ASSISTANT_METHOD}&fromDate=${startDate}&toDate=${endDate}&latitude=${latitude}&longitude=${longitude}&jobId=${jobId}&when=2`;
    }
    console.log(
      "THE URL FOR API SCHEDULING IS " + apiUrlForSchedulingAssistant
    );
    rdvForJob = await fetch(apiUrlForSchedulingAssistant, {
      method: "GET",
      headers: {
        Authorization: authInfo,
      },
    }).then((response) => response.json());

    if (
      rdvForJob.Result &&
      Array.isArray(rdvForJob.Result) &&
      rdvForJob.Result.length > 0
    ) {
      console.log(
        "FUNCTION SCHEDULE ASSISTANT //////// response:" +
          JSON.stringify(rdvForJob)
      );
      creneauxDispos = true;
    } else if (dayShift < 90) {
      console.log("numberOfDays" + dayShift);
      dayShift += 8;
    } else {
      //Dans le cas où il n'y pas de créneaux dans les 30 jours on sors du traitement
      creneauxDispos = true;
    }
  }
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

const getSkillIdFromName = async (skillName) => {
  // const skills = await getSkills();
  // console.log("Skill demandé (skillName): " + skillName);
  // console.log("Skills récupérés: " + JSON.stringify(skills));
  // if (skills !== null) {
  //   const skill = skills.Result.filter(
  //     (attribute) => attribute.AttributeName === skillName
  //   );
  //   if (skill !== null || skill === undefined) {
  //     return skill[0].AttributeId;
  //   }
  // }

  //TODO Handle ERRORS
  return null;
};

function getCurrentDateWithOffset(offsetDays) {
  const today = new Date();
  console.log("THE OFFSET IS " + offsetDays);

  const parsedOffset = parseInt(offsetDays, 10);
  console.log("THE PARSED OFFSET IS " + parsedOffset);
  today.setDate(today.getDate() + parseInt(offsetDays, 10));
  console.log("THE ADDED OFFSET IS " + parsedOffset);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
