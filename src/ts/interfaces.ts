export interface simpleJSON {
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

export namespace ProgramJSON {

    export interface Level {
        uid: number;
        leveledu: string;
    }

    export interface Comment {
        uid: number;
        fullName: string;
        photo: any;
        year: string;
        message: string;
        link: string;
    }

    export interface Achievement {
        studentsText: string;
        studentsLink: string;
    }

    export interface Program {
        isu: number;
        email: string;
        phone: string;
        site: string;
        vk: string;
        tg: string;
        leed: string;
        description: string;
        video1: string;
        video2: string;
        video3: string;
        video4: string;
        video5: string;
        video6: string;
        partner: any;
        specializationName: string;
        specializationDescription: string;
        personIsu: string;
        peopleIsu: string[];
        careerLeed: string;
        careerDescription: string;
        careerPartner: any;
        achievements: Achievement[];
        similarPrograms: string[];
        scholarshipName: string;
        scholarshipLeed: string;
        premaster: string[];
        video7: string;
        video8: string;
        videos?: string[];
        onePartner: string;
    }

    export interface Faq {
        question: string;
        answer: string;
    }

    export interface MinScore {
        discipline: string;
        value: number;
    }

    export interface LastYear {
        group: string;
        exam: string;
        hint: string;
        pass_score?: number;
        average?: number;
    }

    export interface Root {
        level: Level[];
        comments: Comment[];
        programs: Program[];
        faq: Faq[];
        minScore: MinScore[];
        lastYear: LastYear[];
    }

}

export type allJSON = simpleJSON | ProgramJSON.Root[] | ILogAppFull;