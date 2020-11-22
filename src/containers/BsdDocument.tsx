import * as React from "react";
import { useFormikContext, Field } from "formik";
import {
  BsdContainer,
  BsdBox,
  BsdBoxColumn,
  BsdLabel,
  BsdList,
  BsdListItem,
  BsdInputField,
} from "../components";

export interface Bsd {
  customId: string;
  emitter: Emitter;
  temporaryStorage: TemporaryStorage | null;
  waste: Waste;
  adr: string;
  packages: Packages;
  quantity: Quantity;
  transporter: Transporter;
  recipient: Recipient;
}
interface Recipient {
  company: Company;
  reception: Reception | null;
  treatment: Treatment;
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
export enum QuantityType {
  Estimated = "ESTIMATED",
  Real = "REAL",
}
interface Packages {
  type: PackagesType;
  quantity: number;
  description: string;
}
export enum PackagesType {
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
export enum WasteConsistency {
  Solid = "SOLID",
  Liquid = "LIQUID",
  Gaseous = "GASEOUS",
}
interface Emitter {
  type: EmitterType;
  company: Company;
  signature: Signature | null;
}
export enum EmitterType {
  Producer = "PRODUCER",
  Appendix1 = "APPENDIX1",
  Appendix2 = "APPENDIX2",
  Other = "OTHER",
}
interface TemporaryStorage {
  company: Company;
  reception: Reception | null;
  treatment: Treatment;
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

export function BsdDocument() {
  const { values, setFieldValue } = useFormikContext<Bsd>();
  return (
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
                Collecteur de petites quantités de déchets relevant d’une même
                rubrique (joindre annexe 1)
              </label>
            </BsdListItem>
            <BsdListItem>
              <label>
                <Field
                  type="radio"
                  name="emitter.type"
                  value={EmitterType.Appendix2}
                />{" "}
                Personne ayant transformé ou réalisé un traitement dont la
                provenance des déchets reste identifiable (joindre annexe 2)
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
                    Opération d’élimination / valorisation prévue (code D/R) :{" "}
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
              <Field component={BsdInputField} type="text" name="adr" />
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
                    onClick={() => setFieldValue("transporter.signature", null)}
                  >
                    Annuler l'enlèvement
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
                      author: values.transporter.company.contact,
                    })
                  }
                >
                  Signer l'enlèvement
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
              Je soussigné certifie que les renseignements portés dans les
              cadres ci-dessus sont exacts et établis de bonne foi.
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
                    onClick={() => setFieldValue("emitter.signature", null)}
                  >
                    Annuler l'enlèvement
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
                      author: values.emitter.company.contact,
                    })
                  }
                >
                  Signer l'enlèvement
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
                        setFieldValue("recipient.reception.refusal", null)
                      }
                      checked={values.recipient.reception?.refusal == null}
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
                      checked={values.recipient.reception?.refusal != null}
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
                          setFieldValue("recipient.reception.signature", null)
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
                          setFieldValue("recipient.reception.signature", {
                            date: new Date().toLocaleDateString(),
                            author: values.recipient.company.contact,
                          })
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
          <BsdList>
            <BsdListItem>
              <label>
                Code D/R :{" "}
                <Field
                  component={BsdInputField}
                  type="text"
                  name="recipient.treatment.operation.code"
                />
              </label>
            </BsdListItem>
            <BsdListItem>
              <label>
                Description :{" "}
                <Field
                  component={BsdInputField}
                  type="text"
                  name="recipient.treatment.operation.description"
                />
              </label>
            </BsdListItem>
          </BsdList>
          <BsdList>
            {values.recipient.treatment.signature ? (
              <>
                <BsdListItem>
                  Je soussigné certifie que l’opération ci-dessus a été
                  effectuée
                </BsdListItem>
                <BsdListItem>
                  <label>
                    Date :{" "}
                    <Field
                      component={BsdInputField}
                      type="string"
                      name="recipient.treatment.signature.date"
                    />
                  </label>
                </BsdListItem>
                <BsdListItem>
                  <label>
                    Signature :{" "}
                    <Field
                      component={BsdInputField}
                      type="string"
                      name="recipient.treatment.signature.author"
                    />
                  </label>
                </BsdListItem>
                <BsdListItem>
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue("recipient.treatment.signature", null)
                    }
                  >
                    Annuler la réalisation de l'opération
                  </button>
                </BsdListItem>
              </>
            ) : (
              <BsdListItem>
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue("recipient.treatment.signature", {
                      date: new Date().toLocaleDateString(),
                      author: values.recipient.company.contact,
                    })
                  }
                >
                  Signer la réalisation de l'opération
                </button>
              </BsdListItem>
            )}
          </BsdList>
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
                13. Réception dans l’installation d’entreposage ou de
                reconditionnement
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
                            values.temporaryStorage.reception?.refusal == null
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
                            values.temporaryStorage.reception?.refusal != null
                          }
                        />{" "}
                        Non
                      </label>
                    </BsdListItem>
                  </BsdList>
                  {values.temporaryStorage.reception?.refusal != null && (
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
                    {values.temporaryStorage.reception?.signature ? (
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
                                author: values.temporaryStorage!.company
                                  .contact,
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
                        setFieldValue("temporaryStorage.reception", {
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
              <BsdLabel>14. Installation de destination prévue</BsdLabel>
            </BsdBoxColumn>
          </BsdBox>
        </>
      )}
    </BsdContainer>
  );
}
