const apiKey = process.env.BIG_CHANGE_API_KEY;
const apiAuth = process.env.BIG_CHANGE_API_BASIC_AUTH;
const authInfo = `Basic ${apiAuth}`;
const BIGCHANGE_BASE_API = `https://webservice.bigchangeapps.com/v01/services.ashx?key=${apiKey}`;

export const handler = async (event, context) => {
  const params = event.queryStringParameters;
  const jobId = params.jobId;
  const jobRef = params.jobRef;
  const resourceId = params.resourceId;
  const resourceRef = params.resourceRef;
  const scheduleDate = params.scheduleDate;
  const durationMins = params.duration;

  const scheduleJob = await scheduleJobs(
    jobId,
    jobRef,
    resourceId,
    resourceRef,
    scheduleDate,
    durationMins
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ scheduleJob }),
  };
};

const scheduleJobs = async (
  jobId,
  jobRef,
  resourceId,
  resourceRef,
  scheduleDate,
  durationMins
) => {
  const SCHEDULE_JOB_METHOD = "&action=JobSchedule";
  const apiUrlForSchedulingJob = `${BIGCHANGE_BASE_API}${SCHEDULE_JOB_METHOD}&jobId=${jobId}&jobRef=${jobRef}&resourceId=${resourceId}&resourceRef=${resourceRef}&scheduleDate=${scheduleDate}&durationMins=${durationMins}`;

  const resultJobSchedule = await fetch(apiUrlForSchedulingJob, {
    method: "GET",
    headers: {
      Authorization: authInfo,
    },
  }).then((response) => response.json());
  console.log(
    "FUNCTION SCHEDULE //////// response:" + JSON.stringify(resultJobSchedule)
  );
  return resultJobSchedule;
};
