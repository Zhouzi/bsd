import * as React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import AutosizeInput from "react-input-autosize";
import { Formik, Field, FieldProps } from "formik";
import { diffJson } from "diff";

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 1rem;
    line-height: 1.4;
    color: #060a2b;
    background-color: #f6f7ff;
  }
`;
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;
const LayoutColumn = styled.div`
  max-height: 100vh;
  overflow-y: auto;
`;
const LayoutColumnTitle = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.05rem;
  padding: 1rem;
  color: #5d64a2;
`;
const ExamplesColumn = styled(LayoutColumn)`
  width: 20%;
`;
const BsdColumn = styled(LayoutColumn)`
  flex: 1;
  background-color: #fff;
`;
const CodeColumn = styled(LayoutColumn)`
  width: 30%;
  color: #f6f7ff;
  background-color: #161c4e;
`;

const ExampleItem = styled.article`
  padding: 1rem 1rem 2rem 1rem;
  border-bottom: 1px solid #3d3d3d;
`;
const ExampleItemName = styled.div`
  font-weight: bold;
`;

const BsdContainer = styled.div`
  border-bottom: 1px solid #3d3d3d;
  margin: 1rem;
`;
const BsdBox = styled.div`
  border: 1px solid #3d3d3d;
  border-right: 0;
  border-bottom: 0;
  display: flex;
`;
const BsdBoxColumn = styled.div`
  flex: 1;
  border-right: 1px solid #3d3d3d;
  padding: 0.5rem;
`;
const BsdLabel = styled.label`
  display: block;
  width: 100%;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;
const BsdInput = styled(AutosizeInput).attrs({ placeholder: " ".repeat(6) })`
  & input {
    font: inherit;
    font-family: "Pangolin", cursive;
    color: inherit;
    padding: 0;
    border: 0;
    background-color: transparent;

    &:not(:focus) {
      cursor: pointer;
    }
  }
`;
function BsdInputField({ field, form, ...props }: FieldProps) {
  return <BsdInput {...field} {...props} />;
}

const BsdList = styled.ul<{ orientation?: "horizontal" | "vertical" }>`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;

  ${(props) => {
    switch (props.orientation) {
      case "horizontal":
        return css`
          display: flex;
        `;
      case "vertical":
      default:
        return css`
           ;
        `;
    }
  }}
`;
const BsdListItem = styled.li`
  margin: 0 0.5rem 0.25rem 0;
`;

const CodeContainer = styled.pre`
  padding: 1rem 0;
  font-family: "Source Code Pro", monospace;
  margin: 0 0 0.5rem 0;
`;
const CodeLine = styled.div<{ variant: "added" | "removed" | "unchanged" }>`
  padding: 0 1rem;

  ${(props) => {
    switch (props.variant) {
      case "added":
        return css`
          background-color: #197546;
        `;
      case "removed":
        return css`
          background-color: #ab3939;
        `;
      case "unchanged":
      default:
        return css``;
    }
  }}
`;

interface Bsd {
  customId: string;
  emitter: Emitter;
  temporaryStorage: TemporaryStorage | null;
  waste: Waste;
  adr: string;
  packages: Packages;
  quantity: Quantity<QuantityType>;
  transporter: Transporter;
  recipient: Recipient;
  finalProcessingOperation: FinalProcessingOperation | null;
}
interface FinalProcessingOperation {
  processingOperation: ProcessingOperation;
  signature: Signature;
}
interface Recipient {
  company: Company;
  quantity: Quantity<QuantityType.Real>;
  arrivedAt: string | null;
  refusal: string | null;
  signature: Signature | null;
}
interface Transporter {
  company: Company;
  receipt: TransporterReceipt;
  signature: Signature | null;
}
interface Signature {
  author: string;
  date: string;
}
interface TransporterReceipt {
  number: string;
  validityLimit: string;
  transportMode: string;
  department: string;
}
interface Quantity<T extends QuantityType> {
  type: T;
  tons: number;
}
enum QuantityType {
  Estimated = "ESTIMATED",
  Real = "REAL",
}
interface Packages {
  type: PackagesType;
  quantity: number;
  description: string;
}
enum PackagesType {
  Benne = "BENNE",
  GRV = "GRV",
  Fut = "FUT",
  Other = "OTHER",
}
interface Waste {
  code: string;
  description: string;
  consistency: WasteConsistency;
}
enum WasteConsistency {
  Solid = "SOLID",
  Liquid = "LIQUID",
  Gaseous = "GASEOUS",
}
interface Emitter {
  type: EmitterType;
  company: Company;
  signature: Signature | null;
}
enum EmitterType {
  Producer = "PRODUCER",
  Appendix1 = "APPENDIX1",
  Appendix2 = "APPENDIX2",
  Other = "OTHER",
}
interface TemporaryStorage {
  company: Company;
  cap: string;
  processingOperation: ProcessingOperation;
}
interface ProcessingOperation {
  code: string;
  description: string;
}
interface Company {
  siret: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
}

interface Example {
  name: string;
  description: string;
  steps: ExampleStep[];
}
interface ExampleStep {
  name: string;
  bsd: Bsd;
}

function createBsd({
  customId = "",
  emitter = createEmitter({}),
  temporaryStorage = null,
  waste = createWaste({}),
  adr = "",
  packages = createPackages({}),
  quantity = createQuantity({}),
  transporter = createTransporter({}),
  recipient = createRecipient({}),
  finalProcessingOperation = null,
}: Partial<Bsd>): Bsd {
  return {
    customId,
    emitter,
    temporaryStorage,
    waste,
    adr,
    packages,
    quantity,
    transporter,
    recipient,
    finalProcessingOperation,
  };
}
function createEmitter({
  type = EmitterType.Producer,
  company = createCompany({}),
  signature = null,
}: Partial<Emitter>): Emitter {
  return {
    type,
    company,
    signature,
  };
}
function createCompany({
  siret = "",
  name = "",
  address = "",
  phone = "",
  email = "",
  contact = "",
}: Partial<Company>): Company {
  return {
    siret,
    name,
    address,
    phone,
    email,
    contact,
  };
}
function createWaste({
  code = "",
  description = "",
  consistency = WasteConsistency.Solid,
}: Partial<Waste>): Waste {
  return {
    code,
    description,
    consistency,
  };
}
function createPackages({
  type = PackagesType.Benne,
  quantity = 0,
  description = "",
}: Partial<Packages>): Packages {
  return {
    type,
    quantity,
    description,
  };
}
function createQuantity({
  type = QuantityType.Estimated,
  tons = 0,
}: Partial<Quantity<any>>): Quantity<any> {
  return {
    type,
    tons,
  };
}
function createTransporter({
  company = createCompany({}),
  receipt = createReceipt({}),
  signature = null,
}: Partial<Transporter>): Transporter {
  return {
    company,
    receipt,
    signature,
  };
}
function createReceipt({
  number = "",
  department = "",
  validityLimit = "",
  transportMode = "",
}: Partial<TransporterReceipt>): TransporterReceipt {
  return {
    number,
    department,
    validityLimit,
    transportMode,
  };
}
function createRecipient({
  arrivedAt = null,
  company = createCompany({}),
  quantity = createQuantity({ type: QuantityType.Real }),
  refusal = null,
  signature = null,
}: Partial<Recipient>): Recipient {
  return {
    arrivedAt,
    company,
    quantity,
    refusal,
    signature,
  };
}
function createTemporaryStorage({
  company = createCompany({}),
  cap = "",
  processingOperation = createProcessingOperation({}),
}: Partial<TemporaryStorage>): TemporaryStorage {
  return {
    company,
    cap,
    processingOperation,
  };
}
function createProcessingOperation({
  code = "",
  description = "",
}: Partial<ProcessingOperation>): ProcessingOperation {
  return {
    code,
    description,
  };
}

const EXAMPLES: Example[] = [
  {
    name: "Simple",
    description: "Le déchet part du producteur et va directement à l'exutoire.",
    steps: [
      {
        name: "Création",
        bsd: createBsd({
          customId: "EX-0001-AA",
          emitter: createEmitter({
            type: EmitterType.Producer,
            company: createCompany({
              siret: "1234567890123",
              name: "Acme",
              address: "12 rue Michel Dupont, 69001 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@acme.com",
              contact: "DURAND Marie",
            }),
          }),
          temporaryStorage: null,
          waste: createWaste({
            code: "01 01 01",
            consistency: WasteConsistency.Solid,
          }),
          adr: "",
          packages: createPackages({
            type: PackagesType.Benne,
            quantity: 1,
          }),
          quantity: createQuantity({
            type: QuantityType.Estimated,
            tons: 0.5,
          }),
          transporter: createTransporter({
            company: createCompany({
              siret: "1234567890123",
              name: "MOVIT",
              address: "49 rue Mérieu, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@movit.com",
              contact: "DUPONT Jeanne",
            }),
            receipt: createReceipt({
              number: "1239091023912",
              department: "69",
              validityLimit: "01/01/2023",
              transportMode: "routier",
            }),
          }),
          recipient: createRecipient({
            company: createCompany({
              siret: "1234567890123",
              name: "PROCEXOR",
              address: "3 rue des Acacias, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@procexor.com",
              contact: "BOYER Baptiste",
            }),
            quantity: createQuantity({
              type: QuantityType.Real,
              tons: 1,
            }),
          }),
        }),
      },
      {
        name: "Signature de l'enlèvement",
        bsd: createBsd({
          customId: "EX-0001-AA",
          emitter: createEmitter({
            type: EmitterType.Producer,
            company: createCompany({
              siret: "1234567890123",
              name: "Acme",
              address: "12 rue Michel Dupont, 69001 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@acme.com",
              contact: "DURAND Marie",
            }),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "DURAND Marie",
            },
          }),
          temporaryStorage: null,
          waste: createWaste({
            code: "01 01 01",
            consistency: WasteConsistency.Solid,
          }),
          adr: "",
          packages: createPackages({
            type: PackagesType.Benne,
            quantity: 1,
          }),
          quantity: createQuantity({
            type: QuantityType.Estimated,
            tons: 0.5,
          }),
          transporter: createTransporter({
            company: createCompany({
              siret: "1234567890123",
              name: "MOVIT",
              address: "49 rue Mérieu, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@movit.com",
              contact: "DUPONT Jeanne",
            }),
            receipt: createReceipt({
              number: "1239091023912",
              department: "69",
              validityLimit: "01/01/2023",
              transportMode: "routier",
            }),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "DUPONT Jeanne",
            },
          }),
          recipient: createRecipient({
            company: createCompany({
              siret: "1234567890123",
              name: "PROCEXOR",
              address: "3 rue des Acacias, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@procexor.com",
              contact: "BOYER Baptiste",
            }),
            quantity: createQuantity({
              type: QuantityType.Real,
              tons: 1,
            }),
          }),
        }),
      },
      {
        name: "Réception à l'installation de destination",
        bsd: createBsd({
          customId: "EX-0001-AA",
          emitter: createEmitter({
            type: EmitterType.Producer,
            company: createCompany({
              siret: "1234567890123",
              name: "Acme",
              address: "12 rue Michel Dupont, 69001 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@acme.com",
              contact: "DURAND Marie",
            }),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "DURAND Marie",
            },
          }),
          temporaryStorage: null,
          waste: createWaste({
            code: "01 01 01",
            consistency: WasteConsistency.Solid,
          }),
          adr: "",
          packages: createPackages({
            type: PackagesType.Benne,
            quantity: 1,
          }),
          quantity: createQuantity({
            type: QuantityType.Estimated,
            tons: 0.5,
          }),
          transporter: createTransporter({
            company: createCompany({
              siret: "1234567890123",
              name: "MOVIT",
              address: "49 rue Mérieu, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@movit.com",
              contact: "DUPONT Jeanne",
            }),
            receipt: createReceipt({
              number: "1239091023912",
              department: "69",
              validityLimit: "01/01/2023",
              transportMode: "routier",
            }),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "DUPONT Jeanne",
            },
          }),
          recipient: createRecipient({
            arrivedAt: new Date().toLocaleDateString(),
            company: createCompany({
              siret: "1234567890123",
              name: "PROCEXOR",
              address: "3 rue des Acacias, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@procexor.com",
              contact: "BOYER Baptiste",
            }),
            quantity: createQuantity({
              type: QuantityType.Real,
              tons: 1,
            }),
          }),
        }),
      },
      {
        name: "Accepté par l'installation de destination",
        bsd: createBsd({
          customId: "EX-0001-AA",
          emitter: createEmitter({
            type: EmitterType.Producer,
            company: createCompany({
              siret: "1234567890123",
              name: "Acme",
              address: "12 rue Michel Dupont, 69001 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@acme.com",
              contact: "DURAND Marie",
            }),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "DURAND Marie",
            },
          }),
          temporaryStorage: null,
          waste: createWaste({
            code: "01 01 01",
            consistency: WasteConsistency.Solid,
          }),
          adr: "",
          packages: createPackages({
            type: PackagesType.Benne,
            quantity: 1,
          }),
          quantity: createQuantity({
            type: QuantityType.Estimated,
            tons: 0.5,
          }),
          transporter: createTransporter({
            company: createCompany({
              siret: "1234567890123",
              name: "MOVIT",
              address: "49 rue Mérieu, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@movit.com",
              contact: "DUPONT Jeanne",
            }),
            receipt: createReceipt({
              number: "1239091023912",
              department: "69",
              validityLimit: "01/01/2023",
              transportMode: "routier",
            }),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "DUPONT Jeanne",
            },
          }),
          recipient: createRecipient({
            arrivedAt: new Date().toLocaleDateString(),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "BOYER Baptiste",
            },
            company: createCompany({
              siret: "1234567890123",
              name: "PROCEXOR",
              address: "3 rue des Acacias, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@procexor.com",
              contact: "BOYER Baptiste",
            }),
            quantity: createQuantity({
              type: QuantityType.Real,
              tons: 1,
            }),
          }),
        }),
      },
      {
        name: "Traité par l'installation de destination",
        bsd: createBsd({
          customId: "EX-0001-AA",
          emitter: createEmitter({
            type: EmitterType.Producer,
            company: createCompany({
              siret: "1234567890123",
              name: "Acme",
              address: "12 rue Michel Dupont, 69001 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@acme.com",
              contact: "DURAND Marie",
            }),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "DURAND Marie",
            },
          }),
          temporaryStorage: null,
          waste: createWaste({
            code: "01 01 01",
            consistency: WasteConsistency.Solid,
          }),
          adr: "",
          packages: createPackages({
            type: PackagesType.Benne,
            quantity: 1,
          }),
          quantity: createQuantity({
            type: QuantityType.Estimated,
            tons: 0.5,
          }),
          transporter: createTransporter({
            company: createCompany({
              siret: "1234567890123",
              name: "MOVIT",
              address: "49 rue Mérieu, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@movit.com",
              contact: "DUPONT Jeanne",
            }),
            receipt: createReceipt({
              number: "1239091023912",
              department: "69",
              validityLimit: "01/01/2023",
              transportMode: "routier",
            }),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "DUPONT Jeanne",
            },
          }),
          recipient: createRecipient({
            arrivedAt: new Date().toLocaleDateString(),
            signature: {
              date: new Date().toLocaleDateString(),
              author: "BOYER Baptiste",
            },
            company: createCompany({
              siret: "1234567890123",
              name: "PROCEXOR",
              address: "3 rue des Acacias, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@procexor.com",
              contact: "BOYER Baptiste",
            }),
            quantity: createQuantity({
              type: QuantityType.Real,
              tons: 1,
            }),
          }),
          finalProcessingOperation: {
            processingOperation: {
              code: "R1",
              description: "Traitement R1",
            },
            signature: {
              date: new Date().toLocaleDateString(),
              author: "BOYER Baptiste",
            },
          },
        }),
      },
    ],
  },
  {
    name: "Entreposage provisoire",
    description:
      "Le déchet part du producteur, est entreposé provisoirement avant d'aller vers l'exutoire.",
    steps: [
      {
        name: "Création",
        bsd: createBsd({
          customId: "EX-0001-AA",
          emitter: createEmitter({
            type: EmitterType.Producer,
            company: createCompany({
              siret: "1234567890123",
              name: "Acme",
              address: "12 rue Michel Dupont, 69001 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@acme.com",
              contact: "DURAND Marie",
            }),
          }),
          temporaryStorage: createTemporaryStorage({
            company: createCompany({
              siret: "1234567890123",
              name: "Regroupeur Inc",
              address: "3 rue du Général de Gaulle, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@regroupeur-inc.com",
              contact: "PAYET Jérémy",
            }),
            cap: "0001",
            processingOperation: createProcessingOperation({
              code: "R1",
            }),
          }),
          waste: createWaste({
            code: "01 01 01",
            consistency: WasteConsistency.Solid,
          }),
          packages: createPackages({
            type: PackagesType.Benne,
            quantity: 1,
          }),
          quantity: createQuantity({
            type: QuantityType.Estimated,
            tons: 0.5,
          }),
          transporter: createTransporter({
            company: createCompany({
              siret: "1234567890123",
              name: "MOVIT",
              address: "49 rue Mérieu, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@movit.com",
              contact: "DUPONT Jeanne",
            }),
            receipt: createReceipt({
              number: "1239091023912",
              department: "69",
              validityLimit: "01/01/2023",
              transportMode: "routier",
            }),
            signature: null,
          }),
          recipient: createRecipient({
            arrivedAt: null,
            company: createCompany({
              siret: "1234567890123",
              name: "PROCEXOR",
              address: "3 rue des Acacias, 69000 Lyon",
              phone: "06 12 34 56 78",
              email: "contact@procexor.com",
              contact: "BOYER Baptiste",
            }),
            quantity: createQuantity({
              type: QuantityType.Real,
              tons: 1,
            }),
          }),
        }),
      },
    ],
  },
];

function App() {
  const [state, setState] = React.useState<{ example: Example; step: number }>({
    example: EXAMPLES[0],
    step: EXAMPLES[0].steps.length - 1,
  });

  return (
    <>
      <GlobalStyle />
      <Layout>
        <ExamplesColumn>
          <LayoutColumnTitle>Scénarios</LayoutColumnTitle>
          {EXAMPLES.map((example) => (
            <ExampleItem key={example.name}>
              <ExampleItemName>{example.name}</ExampleItemName>
              <small>{example.description}</small>
              <ol>
                {example.steps.map((step, index) => (
                  <li
                    key={step.name}
                    onClick={() => setState({ example, step: index })}
                    style={{
                      fontWeight:
                        state.example === example && state.step === index
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {step.name}
                  </li>
                ))}
              </ol>
            </ExampleItem>
          ))}
        </ExamplesColumn>
        <Formik
          initialValues={state.example.steps[state.step].bsd}
          onSubmit={() => {}}
          enableReinitialize
        >
          {({ initialValues, values, setFieldValue }) => (
            <>
              <BsdColumn>
                <LayoutColumnTitle>BSD</LayoutColumnTitle>
                <BsdContainer>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>Bordereau n° :</BsdLabel>{" "}
                      <Field component={BsdInputField} name="customId" />
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>1. Émetteur du bordereau</BsdLabel>
                      <BsdList>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="emitter.type"
                              value={EmitterType.Producer}
                            />{" "}
                            Producteur du déchet
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="emitter.type"
                              value={EmitterType.Appendix1}
                            />{" "}
                            Collecteur de petites quantités de déchets relevant
                            d’une même rubrique (joindre annexe 1)
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="emitter.type"
                              value={EmitterType.Appendix2}
                            />{" "}
                            Personne ayant transformé ou réalisé un traitement
                            dont la provenance des déchets reste identifiable
                            (joindre annexe 2)
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="emitter.type"
                              value={EmitterType.Other}
                            />{" "}
                            Autre détenteur
                          </label>
                        </BsdListItem>
                      </BsdList>

                      <BsdList>
                        <BsdListItem>
                          <label>
                            N° SIRET :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="emitter.company.siret"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            NOM :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="emitter.company.name"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Adresse :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="emitter.company.address"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Tél :{" "}
                            <Field
                              component={BsdInputField}
                              type="phone"
                              name="emitter.company.phone"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Mél :{" "}
                            <Field
                              component={BsdInputField}
                              type="email"
                              name="emitter.company.email"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Personne à contacter :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="emitter.company.contact"
                            />
                          </label>
                        </BsdListItem>
                      </BsdList>
                    </BsdBoxColumn>

                    <BsdBoxColumn>
                      <BsdLabel>
                        2. Installation de destination ou d’entreposage ou de
                        reconditionnement prévue
                      </BsdLabel>
                      <BsdList>
                        <BsdListItem>
                          Entreposage provisoire ou reconditionnement
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <input
                              type="radio"
                              name="temporaryStorage"
                              onChange={() => {
                                setFieldValue("temporaryStorage", {
                                  company: {
                                    siret: "",
                                    name: "",
                                    address: "",
                                    phone: "",
                                    email: "",
                                    contact: "",
                                  },
                                  cap: "",
                                  processingOperation: {
                                    code: "",
                                  },
                                });
                              }}
                              checked={Boolean(values.temporaryStorage)}
                            />{" "}
                            Oui
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <input
                              type="radio"
                              name="temporaryStorage"
                              onChange={() => {
                                setFieldValue("temporaryStorage", null);
                              }}
                              checked={values.temporaryStorage == null}
                            />{" "}
                            Non
                          </label>
                        </BsdListItem>
                      </BsdList>

                      {values.temporaryStorage && (
                        <>
                          <BsdList>
                            <BsdListItem>
                              <label>
                                N° SIRET :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="temporaryStorage.company.siret"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                NOM :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="temporaryStorage.company.name"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Adresse :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="temporaryStorage.company.address"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Tél :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="phone"
                                  name="temporaryStorage.company.phone"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Mél :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="email"
                                  name="temporaryStorage.company.email"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Personne à contacter :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="temporaryStorage.company.contact"
                                />
                              </label>
                            </BsdListItem>
                          </BsdList>

                          <BsdList>
                            <BsdListItem>
                              <label>
                                N° de CAP :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="temporaryStorage.cap"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Opération d’élimination / valorisation prévue
                                (code D/R) :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="temporaryStorage.processingOperation.code"
                                />
                              </label>
                            </BsdListItem>
                          </BsdList>
                        </>
                      )}
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>3. Dénomination du déchet</BsdLabel>
                      <BsdList>
                        <BsdListItem>
                          <label>
                            Rubrique du déchet :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="waste.code"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Dénomination usuelle :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="waste.description"
                            />
                          </label>
                        </BsdListItem>
                      </BsdList>
                      <BsdList orientation="horizontal">
                        <BsdListItem>Consistance :</BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="waste.consistency"
                              value={WasteConsistency.Solid}
                            />{" "}
                            Solide
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="waste.consistency"
                              value={WasteConsistency.Liquid}
                            />{" "}
                            Liquide
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="waste.consistency"
                              value={WasteConsistency.Gaseous}
                            />{" "}
                            Gazeux
                          </label>
                        </BsdListItem>
                      </BsdList>
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>
                        4. Mentions au titre des règlements ADR, RID, ADNR, IMDG
                      </BsdLabel>
                      <BsdList>
                        <BsdListItem>
                          <Field
                            component={BsdInputField}
                            type="text"
                            name="adr"
                          />
                        </BsdListItem>
                      </BsdList>
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>5. Conditionnement</BsdLabel>
                      <BsdList orientation="horizontal">
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="packages.type"
                              value={PackagesType.Benne}
                            />{" "}
                            Benne
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="packages.type"
                              value={PackagesType.GRV}
                            />{" "}
                            GRV
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="packages.type"
                              value={PackagesType.Fut}
                            />{" "}
                            Fût
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="packages.type"
                              value={PackagesType.Other}
                            />{" "}
                            Autre (préciser)
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Nombre :{" "}
                            <Field
                              component={BsdInputField}
                              type="number"
                              name="packages.quantity"
                            />
                          </label>
                        </BsdListItem>
                      </BsdList>
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>6. Quantité</BsdLabel>
                      <BsdList orientation="horizontal">
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="quantity.type"
                              value={QuantityType.Estimated}
                            />{" "}
                            Estimée
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <Field
                              type="radio"
                              name="quantity.type"
                              value={QuantityType.Real}
                            />{" "}
                            Réel
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <Field
                            component={BsdInputField}
                            type="number"
                            name="quantity.tons"
                            min="0"
                            step="0.001"
                          />{" "}
                          tonnes
                        </BsdListItem>
                      </BsdList>
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>7. Négociant</BsdLabel>
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>8. Collecteur-transporteur</BsdLabel>
                      <BsdList>
                        <BsdListItem>
                          <label>
                            N° SIRET :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="transporter.company.siret"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            NOM :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="transporter.company.name"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Adresse :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="transporter.company.address"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Tél :{" "}
                            <Field
                              component={BsdInputField}
                              type="phone"
                              name="transporter.company.phone"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Mél :{" "}
                            <Field
                              component={BsdInputField}
                              type="email"
                              name="transporter.company.email"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Personne à contacter :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="transporter.company.contact"
                            />
                          </label>
                        </BsdListItem>
                      </BsdList>
                      <BsdList>
                        <BsdListItem>
                          <label>
                            Récépissé n° :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="transporter.receipt.number"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Département :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="transporter.receipt.department"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Limite de validité :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="transporter.receipt.validityLimit"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Mode de transport :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="transporter.receipt.transportMode"
                            />
                          </label>
                        </BsdListItem>
                      </BsdList>
                      <BsdList>
                        {values.transporter.signature ? (
                          <>
                            <BsdListItem>
                              <label>
                                Date de prise en charge :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="transporter.signature.date"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Signature :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="transporter.signature.author"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue("transporter.signature", null)
                                }
                              >
                                Annuler
                              </button>
                            </BsdListItem>
                          </>
                        ) : (
                          <BsdListItem>
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue("transporter.signature", {
                                  date: new Date().toLocaleDateString(),
                                  author: "VOTRE NOM",
                                })
                              }
                            >
                              Signer la prise en charge
                            </button>
                          </BsdListItem>
                        )}
                      </BsdList>
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>
                        9. Déclaration générale de l’émetteur du bordereau
                      </BsdLabel>
                      <BsdList>
                        <BsdListItem>
                          Je soussigné certifie que les renseignements portés
                          dans les cadres ci-dessus sont exacts et établis de
                          bonne foi.
                        </BsdListItem>
                      </BsdList>
                      <BsdList>
                        {values.emitter.signature ? (
                          <>
                            <BsdListItem>
                              <label>
                                Date de prise en charge :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="emitter.signature.date"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Signature :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="emitter.signature.author"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue("emitter.signature", null)
                                }
                              >
                                Annuler
                              </button>
                            </BsdListItem>
                          </>
                        ) : (
                          <BsdListItem>
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue("emitter.signature", {
                                  date: new Date().toLocaleDateString(),
                                  author: "VOTRE NOM",
                                })
                              }
                            >
                              Signer la prise en charge
                            </button>
                          </BsdListItem>
                        )}
                      </BsdList>
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>
                        10. Expédition reçue à l’installation de destination
                      </BsdLabel>
                      <BsdList>
                        <BsdListItem>
                          <label>
                            N° SIRET :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="recipient.company.siret"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            NOM :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="recipient.company.name"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Adresse :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="recipient.company.address"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Tél :{" "}
                            <Field
                              component={BsdInputField}
                              type="phone"
                              name="recipient.company.phone"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Mél :{" "}
                            <Field
                              component={BsdInputField}
                              type="email"
                              name="recipient.company.email"
                            />
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Personne à contacter :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="recipient.company.contact"
                            />
                          </label>
                        </BsdListItem>
                      </BsdList>
                      <BsdList>
                        <BsdListItem>
                          <label>
                            Quantité réelle présentée :{" "}
                            <Field
                              component={BsdInputField}
                              type="number"
                              name="recipient.quantity.tons"
                            />{" "}
                            tonnes
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            Date de présentation :{" "}
                            <Field
                              component={BsdInputField}
                              type="text"
                              name="recipient.arrivedAt"
                            />
                          </label>
                        </BsdListItem>
                      </BsdList>
                      <BsdList orientation="horizontal">
                        <BsdListItem>Lot accepté :</BsdListItem>
                        <BsdListItem>
                          <label>
                            <input
                              type="radio"
                              name="refusal"
                              onChange={() =>
                                setFieldValue("recipient.refusal", null)
                              }
                              checked={values.recipient.refusal == null}
                            />{" "}
                            Oui
                          </label>
                        </BsdListItem>
                        <BsdListItem>
                          <label>
                            <input
                              type="radio"
                              name="refusal"
                              onChange={() =>
                                setFieldValue(
                                  "recipient.refusal",
                                  "Préciser la raison du refus"
                                )
                              }
                              checked={values.recipient.refusal != null}
                            />{" "}
                            Non
                          </label>
                        </BsdListItem>
                      </BsdList>
                      {values.recipient.refusal != null && (
                        <BsdList>
                          <BsdListItem>
                            <label>
                              Motif du refus :{" "}
                              <Field
                                component={BsdInputField}
                                type="text"
                                name="recipient.refusal"
                              />
                            </label>
                          </BsdListItem>
                        </BsdList>
                      )}
                      <BsdList>
                        {values.recipient.signature ? (
                          <>
                            <BsdListItem>
                              <label>
                                Date de prise en charge :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="recipient.signature.date"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Signature :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="recipient.signature.author"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue("recipient.signature", null)
                                }
                              >
                                Annuler
                              </button>
                            </BsdListItem>
                          </>
                        ) : (
                          <BsdListItem>
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue("recipient.signature", {
                                  date: new Date().toLocaleDateString(),
                                  author: "VOTRE NOM",
                                })
                              }
                            >
                              Signer la prise en charge
                            </button>
                          </BsdListItem>
                        )}
                      </BsdList>
                    </BsdBoxColumn>
                    <BsdBoxColumn>
                      <BsdLabel>11. Réalisation de l’opération</BsdLabel>
                      {values.finalProcessingOperation ? (
                        <>
                          <BsdList>
                            <BsdListItem>
                              <label>
                                Code D/R :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="finalProcessingOperation.processingOperation.code"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Description :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="finalProcessingOperation.processingOperation.description"
                                />
                              </label>
                            </BsdListItem>
                          </BsdList>
                          <BsdList>
                            <BsdListItem>
                              Je soussigné certifie que l’opération ci-dessus a
                              été effectuée
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Date :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="finalProcessingOperation.signature.date"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Signature :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="finalProcessingOperation.signature.author"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue(
                                    "finalProcessingOperation",
                                    null
                                  )
                                }
                              >
                                Annuler
                              </button>
                            </BsdListItem>
                          </BsdList>
                        </>
                      ) : (
                        <BsdList>
                          <BsdListItem>
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue("finalProcessingOperation", {
                                  processingOperation: {
                                    code: "",
                                    description: "",
                                  },
                                  signature: {
                                    date: new Date().toLocaleDateString(),
                                    author: "VOTRE NOM",
                                  },
                                })
                              }
                            >
                              Signer la réalisation de l'opération
                            </button>
                          </BsdListItem>
                        </BsdList>
                      )}
                    </BsdBoxColumn>
                  </BsdBox>
                  <BsdBox>
                    <BsdBoxColumn>
                      <BsdLabel>12. Destination ultérieure prévue</BsdLabel>
                    </BsdBoxColumn>
                  </BsdBox>
                </BsdContainer>
              </BsdColumn>
              <CodeColumn>
                <LayoutColumnTitle>Code</LayoutColumnTitle>
                <CodeContainer>
                  {diffJson(
                    state.example.steps[Math.max(0, state.step - 1)].bsd,
                    values
                  ).map(({ added, removed, value }, index) => (
                    <CodeLine
                      key={index}
                      variant={
                        added ? "added" : removed ? "removed" : "unchanged"
                      }
                    >
                      {value}
                    </CodeLine>
                  ))}
                </CodeContainer>
              </CodeColumn>
            </>
          )}
        </Formik>
      </Layout>
    </>
  );
}

export default App;
