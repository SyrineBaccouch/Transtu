import { Station } from './station';
export class Bus{
    ligne!:string;
    depart!:string;
    destination!:string;
    pdvs!:string;
    pdvb!:string;
    ddvs!:string;
    ddvb!:string;
    frequence!:number;
    stations!: Station[];
}