export interface Bsd {
  customId: string;
  emitter: Emitter;
  temporaryStorage: TemporaryStorage | null;
  recipient: Recipient;
  waste: Waste;
}

interface Waste {
  code: string;
  description: string;
  consistency: WasteConsistency;

  // This field may be changed by the temporaryStorage
  // It seems that it has more to do with the way it's packaged
  // so it should probably be a property of Transporter
  adr: string;
}
export enum WasteConsistency {
  Solid = "SOLID",
  Liquid = "LIQUID",
  Gaseous = "GASEOUS",
}

interface Emitter {
  type: EmitterType;
  company: Company;
  signature: Signature | null;
  nextTreatmentOperation: TreatmentOperation;
}
export enum EmitterType {
  Producer = "PRODUCER",
  Appendix1 = "APPENDIX1",
  Appendix2 = "APPENDIX2",
  Other = "OTHER",
}

interface Transporter {
  company: Company;
  receipt: TransporterReceipt;

  // When creating the BSD, the producer cannot estimate the weight of the packages
  // that are leaving the temporary storage to the final recipient
  // So the weight should probably be nullable
  // It would also make it possible for the producer to not make any estimate
  // and leave it to the transporter when they arrive on the site
  weight: WasteWeight;
  // The packages are also unknown but that's ok since it's an array and thus can be empty
  packages: TransporterPackage[];

  signature: Signature | null;
}
export interface TransporterReceipt {
  number: string;
  department: string;
  expiresAt: string;
  mode: string;
}
export interface TransporterPackage {
  type: TransporterPackageType;
  quantity: number;
}
export enum TransporterPackageType {
  Benne = "BENNE",
  Citerne = "CITERNE",
  GRV = "GRV",
  Fut = "FUT",
  Other = "OTHER",
}

export interface TemporaryStorage {
  company: Company;
  reception: Reception | null;

  // It seems that the temporary storage's treatment is never filled
  // We assume that it did what the emitter thought it would
  // And if the emitter made a mistake, the temporary storage update can change their prediction
  treatment: Treatment | null;

  transporter: Transporter;
  signature: Signature | null;
  nextTreatmentOperation: TreatmentOperation;
}

interface Recipient {
  company: Company;
  reception: Reception | null;
  treatment: Treatment | null;
  transporter: Transporter;
}

export interface Reception {
  date: string;
  weight: WasteWeight;
  refusal: string | null;
  signature: Signature | null;
}

export interface Signature {
  author: string;
  date: string;
}

interface WasteWeight {
  type: WasteWeightType;
  tons: number;
}
export enum WasteWeightType {
  Real = "REAL",
  Estimate = "ESTIMATE",
}

export interface Treatment {
  operation: TreatmentOperation;
  signature: Signature;
}
interface TreatmentOperation {
  code: string;
  description: string;
}

export interface Company {
  siret: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
}
