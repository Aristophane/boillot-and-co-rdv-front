<template>
  <table id="jobs" class="jobsTable">
    <thead>
      <tr>
        <th class="jobColumnTitle">Description</th>
        <th class="jobColumnTitle">Localisation</th>
        <th class="jobColumnTitle">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr :class="getRowClass(job)" v-for="job in jobs">
        <td>
          {{ job.Type }} <br />
          Durée: {{ formatTime(job.Duration) }}
        </td>
        <td>{{ job.Location }}</td>
        <td>
          {{ transformStatus(job.Status) }} <br />{{
            job.PlannedStart !== null ? formatDate(job.PlannedStart) : ""
          }}
        </td>
        <td>
          <button @click="planifierJob(job)" :disabled="isButtonDisabled(job)">
            {{ getButtonLibelle(job) }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div>
    <div v-if="isSchedulingVisible" class="flexColumn">
      <h3 id="creneauxId">Liste des créneaux disponibles</h3>
      <p class="subText">Cliquez sur le créneau qui vous convient</p>
    </div>
    <ul v-if="isSchedulingVisible" class="creneauxJobs">
      <li v-for="item in possibleDates">
        <CreneauRdv @creneau-mounted="focusCreneaux" :jobInfo="item"></CreneauRdv>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from 'vue'; 
import { Job, SchedulingJobInfo } from "../types/JobTypes";
import { ScheduleJobResult } from "../types/JobTypes";
import CreneauRdv from "./CreneauRdv.vue";
import { scrollToElementById, formatDate } from "../common/utils";

const emit = defineEmits(['jobs-mounted']);

onMounted(()=>{
  emit('jobs-mounted');
})

const props = defineProps<{ jobs: Job[] }>();
const scheduleJobAPIUrl = `/.netlify/functions/scheduling-job-assistant`;

const isSchedulingVisible = ref<boolean>(false);
const possibleDates = ref<SchedulingJobInfo[]>([]);

const resetJobStatus = (jobs: Job[]) => {
  jobs.forEach((job) => (job.IsJobSelected = false));
};

const focusCreneaux = ()=>{
  scrollToElementById("creneauxId");
}

const planifierJob = async (job: Job) => {
  resetJobStatus(props.jobs);
  job.IsLoadingPlanification = true;
  job.IsJobSelected = true;

  const params = new URLSearchParams({
    skillType: job.Type,
    latitude: job.JobContactLatitude,
    longitude: job.JobContactLongitude,
    jobId: job.JobId.toString(),
  });

  try {
    possibleDates.value = [];
    const response = await fetch(`${scheduleJobAPIUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`Erreur : ${response.statusText}`);
    }

    const result = await response.json();
    isSchedulingVisible.value = true;
    const jobDurationInMinutes = convertirEnMinutes(job.Duration);
    result.scheduleJob.Result.forEach((element: ScheduleJobResult) => {
      possibleDates.value?.push({
        date: element.starttime,
        resourceId: element.resourceid,
        resourceReference: element.resourcereference ?? "",
        jobId: job.JobId,
        jobRef: job.Ref,
        durationMins: jobDurationInMinutes,
      });
    });
    console.log(
      "FRONT  schedule Assistant Received        ------" +
        JSON.stringify(result)
    );
  } catch (err) {
    console.log(err);
  } finally {
    job.IsLoadingPlanification = false;
    scrollToElementById("creneauxId");
  }
};

const getRowClass = (job: Job): string => {
  return job.IsJobSelected ? "selected-job" : "";
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours}h${minutes > 0 ? minutes : "00"}`;
};

const convertirEnMinutes = (heure: string): string => {
  // Diviser la chaîne par les deux-points pour obtenir heures, minutes et secondes
  const [heures, minutes, secondes] = heure.split(":").map(Number);

  // Calculer les minutes totales
  const totalMinutes = heures * 60 + minutes + secondes / 60;

  // Retourner le nombre total de minutes
  return Math.floor(totalMinutes).toString();
};

const transformStatus = (status: string): string => {
  const statusMapping: { [key: string]: string } = {
    New: "Non planifiée",
    Scheduled: "Planifiée",
    Unscheduled: "Non planifiée",
    Sent: "Envoyée",
    Refused: "Refusée",
    OnTheWay: "En chemin",
    Started: "Commencée",
    Suspended: "Suspendue",
    CompletedOk: "Terminée avec succès",
    CompletedNO: "Terminée sans succès",
  };

  // Si le statut existe dans le dictionnaire, le transformer, sinon retourner l'original
  return statusMapping[status] || status;
};

const getButtonLibelle = (job: Job): string => {
  if (job.IsLoadingPlanification) {
    return "Chargement";
  }

  if (job.Status == "Scheduled") {
    return "Planification effectué";
  }

  if (job.IsJobSelected) {
    return "Planification en Cours";
  } else {
    return "Planifier";
  }
};

const isButtonDisabled = (job: Job) => {
  return job.IsLoadingPlanification || job.Status != "New";
};
</script>

<style scoped>
.subText{
  font-style: italic;
  font-size: 0.8em;
  margin: 0;
}


.flexRow {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 812px) {
  th,
  td {
    font-size: 0.7em;
  }
}

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
  flex-wrap: wrap;
  gap: 1em;
  justify-content: center;
}

li {
  width: 50%;
}

.jobItem {
  background: #0087ff;
}

.jobItem:hover {
  background: #00e5ff;
}
.creneauxJobs {
  margin-bottom: 3em;
  padding: 0 0 0 0;
}

.jobColumnTitle {
  background-color: transparent;
}

.selected-job {
  background-color: rgb(216, 216, 216);
}

.jobsTable {
  margin-bottom: 3em;
}
</style>
