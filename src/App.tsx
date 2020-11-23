import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Formik } from "formik";
import { diffJson } from "diff";
import produce from "immer";
import {
  CodeContainer,
  CodeLine,
  ScenarioItem,
  ScenarioItemDescription,
  ScenarioItemName,
  ScenarioItemStepList,
  ScenarioItemStepListItem,
} from "./components";
import { BsdDocument } from "./containers";
import {
  Bsd,
  EmitterType,
  TransporterPackageType,
  WasteConsistency,
  WasteWeightType,
  Company,
  TransporterReceipt,
} from "./types";

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
const ScenariosColumn = styled(LayoutColumn)`
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

interface Scenario {
  name: string;
  description: string;
  steps: ScenarioStep[];
}
interface ScenarioStep {
  name: string;
  bsd: Bsd;
}

function produceScenarioSteps(
  firstStep: ScenarioStep,
  producers: Array<(previousStep: ScenarioStep) => void>
): ScenarioStep[] {
  return producers
    .map((fn) => produce(fn))
    .reduce((acc, producer) => acc.concat([producer(acc[acc.length - 1])]), [
      firstStep,
    ]);
}

const EMITTER_COMPANY: Company = {
  siret: "9012931804340",
  name: "PRODUCTEUR BOLLIER",
  address: "92 rue Michel Leperlier, 69001 Lyon",
  contact: "GRONDIN Jeanne",
  email: "jeanne@producteur-bollier.com",
  phone: "06 23 53 12 60",
};
const TRANSPORTER_COMPANY: Company = {
  siret: "8059380912480",
  name: "TRANSPORTEUR JOSÉ",
  address: "9 rue Lemarchand, 69000 Lyon",
  contact: "PAYET Jérémy",
  email: "jeremy@transporteur-jose.com",
  phone: "06 98 23 59 43",
};
const TRANSPORTER_RECEIPT: TransporterReceipt = {
  number: "0129301930219",
  department: "69",
  expiresAt: "01/01/2026",
  mode: "routier",
};
const RECIPIENT_COMPANY: Company = {
  siret: "8210328194719",
  name: "COLLECTEUR DUPONT",
  address: "523 rue du Maréchal, 69000 Lyon",
  contact: "RIVIERE Camille",
  email: "camille@collecteur-dupont.com",
  phone: "06 98 24 54 71",
};

const SCENARIOS: Scenario[] = [
  {
    name: "Classique",
    description: "Le déchet part du producteur et va directement à l'exutoire.",
    steps: produceScenarioSteps(
      {
        name: "Création du BSD",
        bsd: {
          customId: "EX-00000001",
          emitter: {
            type: EmitterType.Producer,
            company: EMITTER_COMPANY,
            signature: null,
            nextTreatmentOperation: {
              code: "R1",
              description: "Traitement R1",
            },
          },
          temporaryStorage: null,
          recipient: {
            company: RECIPIENT_COMPANY,
            transporter: {
              company: TRANSPORTER_COMPANY,
              receipt: TRANSPORTER_RECEIPT,
              packages: [
                {
                  type: TransporterPackageType.Benne,
                  quantity: 1,
                },
              ],
              weight: {
                type: WasteWeightType.Estimate,
                tons: 0.5,
              },
              signature: null,
            },
            reception: null,
            treatment: null,
          },
          waste: {
            adr: "",
            code: "01 01 01",
            description: "Débris de métaux",
            consistency: WasteConsistency.Solid,
          },
        },
      },
      [
        (step) => {
          step.name = "Signature de l'enlèvement";
          step.bsd.emitter.signature = {
            author: step.bsd.emitter.company.contact,
            date: new Date().toLocaleDateString(),
          };
          step.bsd.recipient.transporter.signature = {
            author: step.bsd.recipient.transporter.company.contact,
            date: new Date().toLocaleDateString(),
          };
        },
        (step) => {
          step.name = "Arrivée à l'installation de destination";
          step.bsd.recipient.reception = {
            date: new Date().toLocaleDateString(),
            refusal: null,
            signature: null,
            weight: step.bsd.recipient.transporter.weight,
          };
        },
        (step) => {
          step.name = "Accepté par l'installation de destination";
          step.bsd.recipient.reception!.signature = {
            author: step.bsd.recipient.company.contact,
            date: new Date().toLocaleDateString(),
          };
        },
        (step) => {
          step.name = "Traité par l'installation de destination";
          step.bsd.recipient.treatment = {
            operation: step.bsd.emitter.nextTreatmentOperation,
            signature: {
              author: step.bsd.recipient.company.contact,
              date: new Date().toLocaleDateString(),
            },
          };
        },
      ]
    ),
  },
  {
    name: "Entreposage provisoire",
    description:
      "Le déchet passe par une étape d'entreposage provisoire avant d'aller à l'exutoire.",
    steps: produceScenarioSteps(
      {
        name: "Création du BSD",
        bsd: {
          customId: "EX-00000001",
          emitter: {
            type: EmitterType.Producer,
            company: EMITTER_COMPANY,
            signature: null,
            nextTreatmentOperation: {
              code: "R12",
              description: "Regroupement",
            },
          },
          temporaryStorage: {
            company: TRANSPORTER_COMPANY,
            nextTreatmentOperation: {
              code: "R1",
              description: "Traitement R1",
            },
            treatment: null,
            reception: null,
            signature: null,
            transporter: {
              company: TRANSPORTER_COMPANY,
              packages: [],
              receipt: TRANSPORTER_RECEIPT,
              signature: null,
              weight: {
                type: WasteWeightType.Estimate,
                tons: 0.5,
              },
            },
          },
          recipient: {
            company: RECIPIENT_COMPANY,
            transporter: {
              company: TRANSPORTER_COMPANY,
              receipt: TRANSPORTER_RECEIPT,
              packages: [
                {
                  type: TransporterPackageType.Benne,
                  quantity: 1,
                },
              ],
              weight: {
                type: WasteWeightType.Estimate,
                tons: 0.5,
              },
              signature: null,
            },
            reception: null,
            treatment: null,
          },
          waste: {
            adr: "",
            code: "01 01 01",
            description: "Débris de métaux",
            consistency: WasteConsistency.Solid,
          },
        },
      },
      [
        (step) => {
          step.name = "Signature de l'enlèvement";
          step.bsd.emitter.signature = {
            author: step.bsd.emitter.company.contact,
            date: new Date().toLocaleDateString(),
          };
          step.bsd.temporaryStorage!.transporter.signature = {
            author: step.bsd.temporaryStorage!.transporter.company.contact,
            date: new Date().toLocaleDateString(),
          };
        },
        (step) => {
          step.name = "Arrivée à l'entreposage provisoire";
          step.bsd.temporaryStorage!.reception = {
            date: new Date().toLocaleDateString(),
            refusal: null,
            signature: null,
            weight: step.bsd.temporaryStorage!.transporter.weight,
          };
        },
        (step) => {
          step.name = "Accepté par l'entreposage provisoire";
          step.bsd.temporaryStorage!.reception!.signature = {
            author: step.bsd.temporaryStorage!.company.contact,
            date: new Date().toLocaleDateString(),
          };
        },
        (step) => {
          step.name = "Dépârt de l'entreposage provisoire";
          step.bsd.temporaryStorage!.signature = {
            author: step.bsd.temporaryStorage!.company.contact,
            date: new Date().toLocaleDateString(),
          };
          step.bsd.recipient.transporter.signature = {
            author: step.bsd.recipient.transporter.company.contact,
            date: new Date().toLocaleDateString(),
          };
        },
        (step) => {
          step.name = "Arrivée à l'installation de destination";
          step.bsd.recipient.reception = {
            date: new Date().toLocaleDateString(),
            refusal: null,
            signature: null,
            weight: step.bsd.recipient.transporter.weight,
          };
        },
        (step) => {
          step.name = "Accepté par l'installation de destination";
          step.bsd.recipient.reception!.signature = {
            author: step.bsd.recipient.company.contact,
            date: new Date().toLocaleDateString(),
          };
        },
        (step) => {
          step.name = "Traité par l'installation de destination";
          step.bsd.recipient.treatment = {
            operation: step.bsd.emitter.nextTreatmentOperation,
            signature: {
              author: step.bsd.recipient.company.contact,
              date: new Date().toLocaleDateString(),
            },
          };
        },
      ]
    ),
  },
];

function App() {
  const [currentScenario, setCurrentScenario] = React.useState<{
    name: string;
    step: number;
  }>({
    name: SCENARIOS[0].name,
    step: 0,
  });
  const { previousInitialValues, initialValues } = React.useMemo(() => {
    const scenario = SCENARIOS.find(
      (scenario) => scenario.name === currentScenario.name
    );

    if (scenario == null) {
      throw new Error(`No scenario found with name "${currentScenario.name}"`);
    }

    const step = scenario.steps[currentScenario.step];

    if (step == null) {
      throw new Error(`No step found with index ${currentScenario.step}`);
    }

    const previousStep = scenario.steps[Math.max(0, currentScenario.step - 1)];

    return {
      previousInitialValues: previousStep.bsd,
      initialValues: step.bsd,
    };
  }, [currentScenario.name, currentScenario.step]);

  return (
    <>
      <GlobalStyle />
      <Layout>
        <ScenariosColumn>
          <LayoutColumnTitle>Scénarios</LayoutColumnTitle>
          {SCENARIOS.map((scenario) => (
            <ScenarioItem key={scenario.name}>
              <ScenarioItemName>{scenario.name}</ScenarioItemName>
              <ScenarioItemDescription>
                {scenario.description}
              </ScenarioItemDescription>
              <ScenarioItemStepList>
                {scenario.steps.map((step, index) => (
                  <ScenarioItemStepListItem
                    key={step.name}
                    onClick={() =>
                      setCurrentScenario({ name: scenario.name, step: index })
                    }
                    active={
                      currentScenario.name === scenario.name &&
                      currentScenario.step === index
                    }
                  >
                    {step.name}
                  </ScenarioItemStepListItem>
                ))}
              </ScenarioItemStepList>
            </ScenarioItem>
          ))}
        </ScenariosColumn>
        <Formik
          initialValues={initialValues}
          onSubmit={() => {}}
          enableReinitialize
        >
          {({ values }) => (
            <>
              <BsdColumn>
                <LayoutColumnTitle>BSD</LayoutColumnTitle>
                <BsdDocument />
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
