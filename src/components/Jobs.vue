<template>
  <table>
    <thead>
      <tr>
        <th class="jobColumnTitle">Job Ref</th>
        <th class="jobColumnTitle">Job Id</th>
        <th class="jobColumnTitle">Durée du job</th>
        <th class="jobColumnTitle">Description</th>
        <th class="jobColumnTitle">Type</th>
        <th class="jobColumnTitle">Localisation</th>
        <th class="jobColumnTitle">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="job in jobs">
        <td>{{ job.Ref }}</td>
        <td>{{ job.JobId }}</td>
        <td>{{ formatTime(job.Duration) }}</td>
        <td>{{ job.Description }}</td>
        <td>{{ job.Type }}</td>
        <td>{{ job.Location }}</td>
        <td>{{ transformStatus(job.Status) }}</td>
        <button @click="planifierJob(job)" :disabled="job.IsLoadingPlanification">
          {{ job.IsLoadingPlanification ? "Chargement..." : "Planifier" }}
        </button>
      </tr>
    </tbody>
  </table>
  <ul v-if="isSchedulingVisible" >
    <li v-for="item in possibleDates">
      <CreneauRdv :date="item"></CreneauRdv>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Job } from "../types/JobTypes";
import { ScheduleJobResult } from "../types/JobTypes";
import CreneauRdv from "./CreneauRdv.vue";

defineProps<{ jobs: Job[] }>();

const isSchedulingVisible = ref<boolean>(false);
const possibleDates = ref<string[]>([""]);

const planifierJob = async (job: Job) => {
  job.IsLoadingPlanification = true;
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
  } finally {
    job.IsLoadingPlanification = false;
  }
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours}h${minutes > 0 ? minutes : "00"}`;
};

function transformStatus(status: string): string {
  // Dictionnaire des correspondances
  const statusMapping: { [key: string]: string } = {
    "New": "Non planifié",
    "Scheduled": "Planifiée",
    "Unscheduled": "Non planifiée",
    "Sent": "Envoyée",
    "Refused": "Refusée",
    "OnTheWay": "En chemin",
    "Started": "Commencée",
    "Suspended": "Suspendue",
    "CompletedOk": "Terminée avec succès",
    "CompletedNO": "Terminée sans succès"
  };

  // Si le statut existe dans le dictionnaire, le transformer, sinon retourner l'original
  return statusMapping[status] || status;
}
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

ul {
  list-style-type: none;
  display: flex;
  flex-direction: row;
}

li{
  width: 50%;
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
