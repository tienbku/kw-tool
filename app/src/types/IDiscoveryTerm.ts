export interface IDiscoveryTermChild {
  term: string;
  count: number;
}

export interface IDiscoveryTerm {
  term: string;
  count: number;
  children: IDiscoveryTermChild[];
}
