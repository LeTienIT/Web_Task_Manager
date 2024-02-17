
import { notes } from "./Notes";
import { attachments } from "./Attachments";
export interface tasks{
    taskid:number;
    userid:number;
    title:string;
    description:string;
    priority:number;
    deadline:Date;
    status:number;
    projectid:number;
    notes : notes[];
    attachments : attachments[];
}