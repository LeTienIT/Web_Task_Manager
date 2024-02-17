export interface task{
    taskid:number;
    userid:number;
    title:string;
    description:string;
    priority:number;
    deadline:Date|string;
    status:number;
    projectid:number;
}