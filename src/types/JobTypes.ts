// src/types.ts

export interface Job {
    JobId: number;
    Ref: string;
    Type: string;
    Contact: string;
    ContactId: number;
    ContactGoupId: number;
    Postcode: string;
    Location: string;
    JobContactLatitude: string;
    JobContactLongitude: string;
    Duration: string;
    Status: string;
    StatusId: number;
    StatusDate: string;
    DrivingDur: string;
    Description: string;
    DrivingDist: number;
    Actioned: string;
    Created: string;
    IsLoadingPlanification: boolean;
    IsJobSelected: boolean;
  }
  
  export interface ResponseDataForJobs {
    responseForJobs: {
      Code: number;
      Result: Job[];
    };
    clientId: number;
  }
  
  export interface ScheduleJobResult {
    resourceid: number;
    resourcereference: string | null;
    resourcename: string;
    resourcegroupname: string;
    resourceskill: string[];  // Tableau de compétences
    starttime: string;        // Format de date et heure
    extradistance: string;    // Distance supplémentaire sous forme de chaîne (peut-être pour des raisons de précision)
    extradriving: number;     // Distance de conduite supplémentaire
    jobcost: string;          // Coût du travail (string car il semble être au format "0.00")
    averageduration: string | null;  // Durée moyenne (nullable)
    successrate: string | null;      // Taux de réussite (nullable)
    punctuality: string | null;      // Ponctualité (nullable)
  }
  
  export interface ScheduleJob {
    Code: number;
    Result: ScheduleJobResult[];
  }