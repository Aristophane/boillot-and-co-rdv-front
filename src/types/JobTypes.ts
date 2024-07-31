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
    Duration: string;
    Status: string;
    StatusId: number;
    StatusDate: string;
    DrivingDur: string;
    Description: string;
    DrivingDist: number;
    Actioned: string;
    Created: string;
  }
  
  export interface ResponseDataForJobs {
    responseForJobs: {
      Code: number;
      Result: Job[];
    };
    clientId: number;
  }
  