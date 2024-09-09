<template>
  <table>
    <thead>
      <tr>
        <th class="jobColumnTitle">Job Ref</th>
        <th class="jobColumnTitle">Job Id</th>
        <th class="jobColumnTitle">Description</th>
        <th class="jobColumnTitle">Type</th>
        <th class="jobColumnTitle">Localisation</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="job in jobs">
        <td>{{ job.Ref }}</td>
        <td>{{ job.JobId }}</td>
        <td>{{ job.Description }}</td>
        <td>{{ job.Type }}</td>
        <td>{{ job.Location }}</td>
        <button @click="planifierJob(job)">Planifier</button>
      </tr>
    </tbody>
  </table>
  <li v-if="isSchedulingVisible" v-for="item in possibleDates">
    {{ item }}
  </li>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Job } from "../types/JobTypes";
import { ScheduleJobResult  } from "../types/JobTypes";

defineProps<{ jobs: Job[] }>();

const isSchedulingVisible = ref<boolean>(false);
const possibleDates = ref<string[]>([""]);

const planifierJob = async (job: Job) => {
  const scheduleJobAPIUrl = `/.netlify/functions/schedule-job`;

  const params = new URLSearchParams({
    skillType: job.Type,
    latitude: job.JobContactLatitude,
    longitude: job.JobContactLongitude,
    jobId: job.JobId.toString(),
  });

  try {
    possibleDates.value.length = 0;
    const response = await fetch(`${scheduleJobAPIUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Erreur : ${response.statusText}`);
    }

    const result = await response.json();
    isSchedulingVisible.value = true;
    result.scheduleJob.Result.forEach((element: ScheduleJobResult) => {
      possibleDates.value?.push(element.starttime);
    });
    console.log(
      "FRONT  schedule Received        ------" + JSON.stringify(result)
    );
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}

li {
  list-style-type: none;
}

.jobItem {
  background: #0087ff;
}

.jobItem:hover {
  background: #00e5ff;
}

.jobColumnTitle {
  background-color: transparent;
}
</style>
