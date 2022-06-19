import { DataOptions } from "vuetify/types";

export type DataLoader = (options: DataOptions, filters: {}, sort: {}) => Promise<any[]>;
