export interface simpleJSON_base {
    [key: string]: string;
}

export interface ApplLog {
    full_name: string;
    patronymic: string;
    surname: string;
    name: string;
    id: number;
    uid_epgu: number;
    id_entrant: number;
    agree: string;
    agree_date: string | Date;
    need_hostel: string;
    sum_m: number;
    sum_r: number;
    sum_i: number;
    sum_p: number;
    sum_b: number;
    sum_c: number;
    sum_e: number;
    sum_o: number;
    sum_test: number;
    sum_ach: number;
    sum_total: number;
    program_name: string;
    program_code: string;
    program_source: string;
    benefits: string;
    benefits_valid: string;
    benefits2: string;
    benefits_valid2: string;
    snils: string;
    availability_edu_doc: string;
}

export interface ILogAppFull { [key: string]: ApplLog; }

export type simpleJSON = ILogAppFull;