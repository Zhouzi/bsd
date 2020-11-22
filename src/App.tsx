import * as React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import AutosizeInput from "react-input-autosize";
import { Formik, Field, FieldProps } from "formik";
import { diffJson } from "diff";
import produce from "immer";

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
  font-size: 0.9rem;
`;

const ExampleItem = styled.article`
  padding: 1rem 1rem 2rem 1rem;
`;
const ExampleItemName = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
  font-weight: bold;
`;
const ExampleItemDescription = styled.small`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;
const ExampleItemStepList = styled.ol`
  margin: 0;
  padding: 0 0 0 1rem;
`;
const ExampleItemStepListItem = styled.li.attrs({
  role: "button",
  tabIndex: 0,
})<{ active: boolean }>`
  cursor: pointer;
  color: #1d68f3;
  text-decoration: underline;
  outline: none;

  ${(props) =>
    props.active &&
    css`
      font-weight: bold;
      text-decoration: none;
    `}
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
function BsdInputField({
  field: { value, ...field },
  form,
  ...props
}: FieldProps) {
  return <BsdInput value={value ?? ""} {...field} {...props} />;
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
  quantity: Quantity;
  transporter: Transporter;
  recipient: Recipient;
  treatment: Treatment | null;
}
interface Recipient {
  company: Company;
  reception: Reception | null;
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
  expiresAt: string;
  transportMode: string;
  department: string;
}
interface Quantity {
  type: QuantityType;
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
  reception: Reception | null;
  treatment: Treatment | null;
  cap: string;
}
interface Reception {
  date: string;
  quantity: Quantity | null;
  refusal: string | null;
  signature: Signature | null;
}
interface Treatment {
  operation: TreatmentOperation;
  signature: Signature | null;
}
interface TreatmentOperation {
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

function createSteps(
  firstStep: ExampleStep,
  producers: Array<(previousStep: ExampleStep) => ExampleStep>
): ExampleStep[] {
  return producers.reduce(
    (acc, producer) => acc.concat([producer(acc[acc.length - 1])]),
    [firstStep]
  );
}

const EXAMPLES: Example[] = [
  {
    name: "Classique",
    description: "Le déchet part du producteur et va directement à l'exutoire.",
    steps: createSteps(
      {
        name: "Création du BSD",
        bsd: {
          customId: "EX-2020-001",
          emitter: {
            company: {
              name: "Garage Bollier",
              siret: "4920184028394",
              address: "32 rue André Bollier, 69007 Lyon",
              contact: "BOYER Jeanne",
              email: "jeanne@garage-bollier.com",
              phone: "06 82 92 18 50",
            },
            signature: null,
            type: EmitterType.Producer,
          },
          temporaryStorage: null,
          waste: {
            code: "01 01 01",
            description: "",
            consistency: WasteConsistency.Solid,
          },
          adr: "",
          packages: {
            description: "",
            quantity: 1,
            type: PackagesType.Benne,
          },
          quantity: {
            type: QuantityType.Estimated,
            tons: 0.43,
          },
          recipient: {
            company: {
              name: "José Collecte d'Huiles",
              siret: "9481927402817",
              address: "12 rue Michel Berthelot, 69000 Lyon",
              contact: "PAYET Jérémy",
              email: "jeremy@jose-collecte-dhuiles.com",
              phone: "09 78 23 12 85",
            },
            reception: null,
          },
          transporter: {
            company: {
              name: "Inter Transports",
              siret: "0419428495012",
              address: "9 impasse des Acacias, 69001 Lyon",
              contact: "GRONDIN Camille",
              email: "camille@inter-transports.com",
              phone: "02 58 30 12 58",
            },
            receipt: {
              expiresAt: "01/01/2026",
              department: "69",
              number: "0129319400851AX",
              transportMode: "routier",
            },
            signature: null,
          },
          treatment: null,
        },
      },
      [
        produce((step: ExampleStep) => {
          step.name = "Signature de l'enlèvement";
          step.bsd.emitter.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.emitter.company.contact,
          };
          step.bsd.transporter.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.transporter.company.contact,
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Arrivée à l'installation de destination";
          step.bsd.recipient.reception = {
            date: new Date().toLocaleDateString(),
            quantity: step.bsd.quantity,
            refusal: null,
            signature: null,
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Accepté par l'installation de destination";
          step.bsd.recipient.reception!.quantity = {
            type: QuantityType.Real,
            tons: 0.5,
          };
          step.bsd.recipient.reception!.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.recipient.company.contact,
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Traité par l'installation de destination";
          step.bsd.treatment = {
            operation: {
              code: "R1",
              description: "Traitement R1",
            },
            signature: {
              date: new Date().toLocaleDateString(),
              author: step.bsd.recipient.company.contact,
            },
          };
        }),
      ]
    ),
  },
  {
    name: "Entreposage provisoire",
    description:
      "Le déchet part du producteur, passe par un entreposage provisoire puis va à l'exutoire.",
    steps: createSteps(
      {
        name: "Création du BSD",
        bsd: {
          customId: "EX-2020-001",
          emitter: {
            company: {
              name: "Garage Bollier",
              siret: "4920184028394",
              address: "32 rue André Bollier, 69007 Lyon",
              contact: "BOYER Jeanne",
              email: "jeanne@garage-bollier.com",
              phone: "06 82 92 18 50",
            },
            signature: null,
            type: EmitterType.Producer,
          },
          temporaryStorage: {
            company: {
              name: "José Entrepôts",
              siret: "01928374618236",
              address: "67 rue Lemarchand, 69001 Lyon",
              contact: "LALLEMAND Antoine",
              email: "antoine@jose-entrepots.com",
              phone: "54 23 95 01 23",
            },
            cap: "",
            reception: null,
            treatment: {
              operation: {
                code: "R12",
                description: "",
              },
              signature: null,
            },
          },
          waste: {
            code: "01 01 01",
            description: "",
            consistency: WasteConsistency.Solid,
          },
          adr: "",
          packages: {
            description: "",
            quantity: 1,
            type: PackagesType.Benne,
          },
          quantity: {
            type: QuantityType.Estimated,
            tons: 0.43,
          },
          recipient: {
            company: {
              name: "José Collecte d'Huiles",
              siret: "9481927402817",
              address: "12 rue Michel Berthelot, 69000 Lyon",
              contact: "PAYET Jérémy",
              email: "jeremy@jose-collecte-dhuiles.com",
              phone: "09 78 23 12 85",
            },
            reception: null,
          },
          transporter: {
            company: {
              name: "Inter Transports",
              siret: "0419428495012",
              address: "9 impasse des Acacias, 69001 Lyon",
              contact: "GRONDIN Camille",
              email: "camille@inter-transports.com",
              phone: "02 58 30 12 58",
            },
            receipt: {
              expiresAt: "01/01/2026",
              department: "69",
              number: "0129319400851AX",
              transportMode: "routier",
            },
            signature: null,
          },
          treatment: null,
        },
      },
      [
        produce((step: ExampleStep) => {
          step.name = "Signature de l'enlèvement";
          step.bsd.emitter.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.emitter.company.contact,
          };
          step.bsd.transporter.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.transporter.company.contact,
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Arrivée à l'entreposage provisoire";
          step.bsd.temporaryStorage!.reception = {
            date: new Date().toLocaleDateString(),
            quantity: step.bsd.quantity,
            refusal: null,
            signature: null,
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Accepté par l'entreposage provisoire";
          step.bsd.temporaryStorage!.reception!.quantity = {
            type: QuantityType.Real,
            tons: 0.5,
          };
          step.bsd.temporaryStorage!.reception!.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.temporaryStorage!.company.contact,
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Traité par l'entreposage provisoire";
          step.bsd.temporaryStorage!.treatment = {
            operation: {
              code: "R12",
              description: "",
            },
            signature: {
              date: new Date().toLocaleDateString(),
              author: step.bsd.temporaryStorage!.company.contact,
            },
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Dépârt de l'entreposage provisoire (incomplet)";
        }),
        produce((step: ExampleStep) => {
          step.name = "Arrivée à l'installation de destination";
          step.bsd.recipient.reception = {
            date: new Date().toLocaleDateString(),
            quantity: step.bsd.quantity,
            refusal: null,
            signature: null,
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Accepté par l'installation de destination";
          step.bsd.recipient.reception!.quantity = {
            type: QuantityType.Real,
            tons: 0.5,
          };
          step.bsd.recipient.reception!.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.recipient.company.contact,
          };
        }),
        produce((step: ExampleStep) => {
          step.name = "Traité par l'installation de destination";
          step.bsd.treatment = {
            operation: {
              code: "R1",
              description: "Traitement R1",
            },
            signature: {
              date: new Date().toLocaleDateString(),
              author: step.bsd.recipient.company.contact,
            },
          };
        }),
      ]
    ),
  },
];

function App() {
  const [state, setState] = React.useState<{ example: string; step: number }>({
    example: EXAMPLES[0].name,
    step: 0,
  });
  const { previousInitialValues, initialValues } = React.useMemo(() => {
    const example = EXAMPLES.find((example) => example.name === state.example);

    if (example == null) {
      throw new Error(`No example found with name "${state.example}"`);
    }

    const step = example.steps[state.step];
    const previousStep = example.steps[Math.max(0, state.step - 1)];

    return {
      previousInitialValues: previousStep.bsd,
      initialValues: step.bsd,
    };
  }, [state.example, state.step]);

  return (
    <>
      <GlobalStyle />
      <Layout>
        <ExamplesColumn>
          <LayoutColumnTitle>Scénarios</LayoutColumnTitle>
          {EXAMPLES.map((example) => (
            <ExampleItem key={example.name}>
              <ExampleItemName>{example.name}</ExampleItemName>
              <ExampleItemDescription>
                {example.description}
              </ExampleItemDescription>
              <ExampleItemStepList>
                {example.steps.map((step, index) => (
                  <ExampleItemStepListItem
                    key={step.name}
                    onClick={() =>
                      setState({ example: example.name, step: index })
                    }
                    active={
                      state.example === example.name && state.step === index
                    }
                  >
                    {step.name}
                  </ExampleItemStepListItem>
                ))}
              </ExampleItemStepList>
            </ExampleItem>
          ))}
        </ExamplesColumn>
        <Formik
          initialValues={initialValues}
          onSubmit={() => {}}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
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
                                  treatment: {
                                    operation: {
                                      code: "R12",
                                      description: "",
                                    },
                                    signature: null,
                                  },
                                  reception: null,
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
                                  name="temporaryStorage.treatment.operation.code"
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
                              name="transporter.receipt.expiresAt"
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
                                Annuler la prise en charge
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
                                Annuler la prise en charge
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
                      {values.recipient.reception ? (
                        <>
                          <BsdList>
                            {/* FIXME: editing this field creates an object that doesn't comply with the Reception interface */}
                            <BsdListItem>
                              <label>
                                Quantité réelle présentée :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="number"
                                  name="recipient.reception.quantity.tons"
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
                                  name="recipient.reception.date"
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
                                    setFieldValue(
                                      "recipient.reception.refusal",
                                      null
                                    )
                                  }
                                  checked={
                                    values.recipient.reception?.refusal == null
                                  }
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
                                      "recipient.reception.refusal",
                                      "Préciser la raison du refus"
                                    )
                                  }
                                  checked={
                                    values.recipient.reception?.refusal != null
                                  }
                                />{" "}
                                Non
                              </label>
                            </BsdListItem>
                          </BsdList>
                          {values.recipient.reception?.refusal != null && (
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
                            {values.recipient.reception?.signature ? (
                              <>
                                <BsdListItem>
                                  <label>
                                    Date de prise en charge :{" "}
                                    <Field
                                      component={BsdInputField}
                                      type="string"
                                      name="recipient.reception.signature.date"
                                    />
                                  </label>
                                </BsdListItem>
                                <BsdListItem>
                                  <label>
                                    Signature :{" "}
                                    <Field
                                      component={BsdInputField}
                                      type="string"
                                      name="recipient.reception.signature.author"
                                    />
                                  </label>
                                </BsdListItem>
                                <BsdListItem>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFieldValue(
                                        "recipient.reception.signature",
                                        null
                                      )
                                    }
                                  >
                                    Annuler la prise en charge
                                  </button>
                                </BsdListItem>
                              </>
                            ) : (
                              <>
                                <BsdListItem>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFieldValue("recipient.reception", null)
                                    }
                                  >
                                    Annuler la réception
                                  </button>
                                </BsdListItem>
                                <BsdListItem>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFieldValue(
                                        "recipient.reception.signature",
                                        {
                                          date: new Date().toLocaleDateString(),
                                          author: "VOTRE NOM",
                                        }
                                      )
                                    }
                                  >
                                    Signer la prise en charge
                                  </button>
                                </BsdListItem>
                              </>
                            )}
                          </BsdList>
                        </>
                      ) : (
                        <BsdList>
                          <BsdListItem>
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue("recipient.reception", {
                                  date: new Date().toLocaleDateString(),
                                  quantity: values.quantity,
                                  refusal: null,
                                  signature: null,
                                })
                              }
                            >
                              Réceptionner le déchet
                            </button>
                          </BsdListItem>
                        </BsdList>
                      )}
                    </BsdBoxColumn>
                    <BsdBoxColumn>
                      <BsdLabel>11. Réalisation de l’opération</BsdLabel>
                      {values.treatment ? (
                        <>
                          <BsdList>
                            <BsdListItem>
                              <label>
                                Code D/R :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="treatment.operation.code"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Description :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="text"
                                  name="treatment.operation.description"
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
                                  name="treatment.signature.date"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <label>
                                Signature :{" "}
                                <Field
                                  component={BsdInputField}
                                  type="string"
                                  name="treatment.signature.author"
                                />
                              </label>
                            </BsdListItem>
                            <BsdListItem>
                              <button
                                type="button"
                                onClick={() => setFieldValue("treatment", null)}
                              >
                                Annuler la réalisation de l'opération
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
                                setFieldValue("treatment", {
                                  operation: {
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
                  {values.temporaryStorage && (
                    <>
                      <BsdBox>
                        <BsdBoxColumn>
                          <BsdLabel>
                            13. Réception dans l’installation d’entreposage ou
                            de reconditionnement
                          </BsdLabel>
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
                          {values.temporaryStorage?.reception ? (
                            <>
                              <BsdList>
                                <BsdListItem>Quantité présentée :</BsdListItem>
                                <BsdListItem>
                                  <label>
                                    <Field
                                      type="radio"
                                      name="temporaryStorage.reception.quantity.type"
                                      value={QuantityType.Estimated}
                                    />{" "}
                                    Estimée
                                  </label>
                                </BsdListItem>
                                <BsdListItem>
                                  <label>
                                    <Field
                                      type="radio"
                                      name="temporaryStorage.reception.quantity.type"
                                      value={QuantityType.Real}
                                    />{" "}
                                    Réel
                                  </label>
                                </BsdListItem>
                                <BsdListItem>
                                  <Field
                                    component={BsdInputField}
                                    type="number"
                                    name="temporaryStorage.reception.quantity.tons"
                                    min="0"
                                    step="0.001"
                                  />{" "}
                                  tonnes
                                </BsdListItem>
                              </BsdList>
                              <BsdList>
                                <BsdListItem>
                                  <label>
                                    Date de présentation :{" "}
                                    <Field
                                      component={BsdInputField}
                                      type="text"
                                      name="temporaryStorage.reception.date"
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
                                      name="temporaryStorage.reception.refusal"
                                      onChange={() =>
                                        setFieldValue(
                                          "temporaryStorage.reception.refusal",
                                          null
                                        )
                                      }
                                      checked={
                                        values.temporaryStorage.reception
                                          ?.refusal == null
                                      }
                                    />{" "}
                                    Oui
                                  </label>
                                </BsdListItem>
                                <BsdListItem>
                                  <label>
                                    <input
                                      type="radio"
                                      name="temporaryStorage.reception.refusal"
                                      onChange={() =>
                                        setFieldValue(
                                          "temporaryStorage.reception.refusal",
                                          "Préciser la raison du refus"
                                        )
                                      }
                                      checked={
                                        values.temporaryStorage.reception
                                          ?.refusal != null
                                      }
                                    />{" "}
                                    Non
                                  </label>
                                </BsdListItem>
                              </BsdList>
                              {values.temporaryStorage.reception?.refusal !=
                                null && (
                                <BsdList>
                                  <BsdListItem>
                                    <label>
                                      Motif du refus :{" "}
                                      <Field
                                        component={BsdInputField}
                                        type="text"
                                        name="temporaryStorage.reception.refusal"
                                      />
                                    </label>
                                  </BsdListItem>
                                </BsdList>
                              )}
                              <BsdList>
                                {values.temporaryStorage.reception
                                  ?.signature ? (
                                  <>
                                    <BsdListItem>
                                      <label>
                                        Date de prise en charge :{" "}
                                        <Field
                                          component={BsdInputField}
                                          type="string"
                                          name="temporaryStorage.reception.signature.date"
                                        />
                                      </label>
                                    </BsdListItem>
                                    <BsdListItem>
                                      <label>
                                        Signature :{" "}
                                        <Field
                                          component={BsdInputField}
                                          type="string"
                                          name="temporaryStorage.reception.signature.author"
                                        />
                                      </label>
                                    </BsdListItem>
                                    <BsdListItem>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setFieldValue(
                                            "temporaryStorage.reception.signature",
                                            null
                                          )
                                        }
                                      >
                                        Annuler la prise en charge
                                      </button>
                                    </BsdListItem>
                                  </>
                                ) : (
                                  <BsdListItem>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFieldValue(
                                          "temporaryStorage.reception.signature",
                                          {
                                            date: new Date().toLocaleDateString(),
                                            author: "VOTRE NOM",
                                          }
                                        )
                                      }
                                    >
                                      Signer la prise en charge
                                    </button>
                                  </BsdListItem>
                                )}
                              </BsdList>
                            </>
                          ) : (
                            <BsdList>
                              <BsdListItem>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFieldValue(
                                      "temporaryStorage.reception",
                                      {
                                        date: new Date().toLocaleDateString(),
                                        quantity: values.quantity,
                                        refusal: null,
                                        signature: null,
                                      }
                                    )
                                  }
                                >
                                  Réceptionner le déchet
                                </button>
                              </BsdListItem>
                            </BsdList>
                          )}
                        </BsdBoxColumn>
                        <BsdBoxColumn>
                          <BsdLabel>
                            14. Installation de destination prévue
                          </BsdLabel>
                        </BsdBoxColumn>
                      </BsdBox>
                    </>
                  )}
                </BsdContainer>
              </BsdColumn>
              <CodeColumn>
                <LayoutColumnTitle>Code</LayoutColumnTitle>
                <CodeContainer>
                  {diffJson(previousInitialValues, values).map(
                    ({ added, removed, value }, index) => (
                      <CodeLine
                        key={index}
                        variant={
                          added ? "added" : removed ? "removed" : "unchanged"
                        }
                      >
                        {value}
                      </CodeLine>
                    )
                  )}
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
