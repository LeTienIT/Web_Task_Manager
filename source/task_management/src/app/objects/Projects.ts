import { Users } from "./Users";
import { tasks } from "./Tasks";
export interface projects{
    projectid : number;
    userid : number;
    title : string;
    description : string;
    visibility : boolean;
    startdate : Date|string; 
    enddate : Date|string;
}