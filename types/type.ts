export interface ILevel {
  title: string;
  value: string;
}

export interface IColumn {
  column: string;
  order: number;
}

export interface IExpandRows {
  [key: string]: boolean;
}

export interface ICustomer {
  name: string;
  phone: string;
  email: string;
  address: string;
  register: string;
  login: string;
  level: string;

  [key: string]: string;
}
