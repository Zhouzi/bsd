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
import {
  Bsd,
  EmitterType,
  WasteConsistency,
  PackagesType,
  QuantityType,
  BsdDocument,
} from "./containers";

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
  producers: Array<(previousStep: ScenarioStep) => ScenarioStep>
): ScenarioStep[] {
  return producers.reduce(
    (acc, producer) => acc.concat([producer(acc[acc.length - 1])]),
    [firstStep]
  );
}

const SCENARIOS: Scenario[] = [
  {
    name: "Classique",
    description: "Le déchet part du producteur et va directement à l'exutoire.",
    steps: produceScenarioSteps(
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
            treatment: {
              operation: {
                code: "R1",
                description: "Traitement R1",
              },
              signature: null,
            },
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
        },
      },
      [
        produce((step: ScenarioStep) => {
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
        produce((step: ScenarioStep) => {
          step.name = "Arrivée à l'installation de destination";
          step.bsd.recipient.reception = {
            date: new Date().toLocaleDateString(),
            quantity: step.bsd.quantity,
            refusal: null,
            signature: null,
          };
        }),
        produce((step: ScenarioStep) => {
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
        produce((step: ScenarioStep) => {
          step.name = "Traité par l'installation de destination";
          step.bsd.recipient.treatment.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.recipient.company.contact,
          };
        }),
      ]
    ),
  },
  {
    name: "Entreposage provisoire",
    description:
      "Le déchet part du producteur, passe par un entreposage provisoire puis va à l'exutoire.",
    steps: produceScenarioSteps(
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
            treatment: {
              operation: {
                code: "R1",
                description: "Traitement R1",
              },
              signature: null,
            },
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
        },
      },
      [
        produce((step: ScenarioStep) => {
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
        produce((step: ScenarioStep) => {
          step.name = "Arrivée à l'entreposage provisoire";
          step.bsd.temporaryStorage!.reception = {
            date: new Date().toLocaleDateString(),
            quantity: step.bsd.quantity,
            refusal: null,
            signature: null,
          };
        }),
        produce((step: ScenarioStep) => {
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
        produce((step: ScenarioStep) => {
          step.name = "Traité par l'entreposage provisoire";
          step.bsd.temporaryStorage!.treatment.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.temporaryStorage!.company.contact,
          };
        }),
        produce((step: ScenarioStep) => {
          step.name = "Dépârt de l'entreposage provisoire (incomplet)";
        }),
        produce((step: ScenarioStep) => {
          step.name = "Arrivée à l'installation de destination";
          step.bsd.recipient.reception = {
            date: new Date().toLocaleDateString(),
            quantity: step.bsd.quantity,
            refusal: null,
            signature: null,
          };
        }),
        produce((step: ScenarioStep) => {
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
        produce((step: ScenarioStep) => {
          step.name = "Traité par l'installation de destination";
          step.bsd.recipient.treatment.signature = {
            date: new Date().toLocaleDateString(),
            author: step.bsd.recipient.company.contact,
          };
        }),
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
