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
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Job } from "../types/JobTypes";

defineProps<{ jobs: Job[] }>();
const isVisible = ref<boolean>(false);

const planifierJob = (job: Job) => {
  isVisible.value = !isVisible.value;
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
