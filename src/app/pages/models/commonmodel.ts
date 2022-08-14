export class standard{
    idStandard:number;
    name:string;
    idSchoolDetails:number
}

export class division{
    idDivision: number;
    name: string;
    idStandard: number;
    idSchoolDetails: number
}


export class subject{
    idSubject: number;
    name: string;
    idStandard: number;
    idSchoolDetails: number;
}

export class nationality{
    idNationality: number;
    name: string;
}

export class country{
    idCountry: number;
    name: string;
}

export class state{
    idState: number;
    idCountry: number;
    name: string;
}

export class city{
    idState: number;
    idCity: number;
    name: string;
}

export class gender{
    name:string;
    value:string;
}


export class parent{
    address1: string;
    address2: string;
    emergencyNo: string;
    gender: string;
    idCity: number;
    idCountry: number;
    idNationality: number;
    idRole: number;
    idSchoolDetails: number;
    idState: number;
    idparent: number;
    name: string;
    pemail: string;
    pmobile_no: string;
    profilepicUrl: string;
    semail: string;
    smobileno: string;
    zipcode: string;
}