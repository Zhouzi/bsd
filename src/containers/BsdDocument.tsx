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
import {
  Bsd,
  EmitterType,
  TemporaryStorage,
  WasteConsistency,
  Signature,
  Reception,
  WasteWeightType,
  Treatment,
} from "../types";
import { BsdCompany } from "./BsdCompany";
import { BsdNextTreatmentOperation } from "./BsdNextTreatmentOperation";
import { BsdPackages } from "./BsdPackages";
import { BsdQuantity } from "./BsdQuantity";
import { BsdTransporterReceipt } from "./BsdTransporterReceipt";
import { BsdSignature } from "./BsdSignature";

export function BsdDocument() {
  const { values, setFieldValue } = useFormikContext<Bsd>();

  return (
    <BsdContainer>
      <BsdBox>
        <BsdBoxColumn>
          <BsdLabel>Bordereau n°</BsdLabel>
          <BsdList>
            <BsdListItem>
              <Field component={BsdInputField} type="text" name="customId" />
            </BsdListItem>
          </BsdList>
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
          <BsdCompany name="emitter.company" />
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
                  name="hasTemporaryStorage"
                  checked={Boolean(values.temporaryStorage)}
                  onChange={() => {
                    const temporaryStorage: TemporaryStorage = {
                      company: values.recipient.transporter.company,
                      reception: null,
                      signature: null,
                      nextTreatmentOperation:
                        values.emitter.nextTreatmentOperation,
                      transporter: values.recipient.transporter,
                      treatment: null,
                    };
                    setFieldValue("temporaryStorage", temporaryStorage);
                  }}
                />{" "}
                Oui (cadres 13 à 19 à remplir)
              </label>
            </BsdListItem>
            <BsdListItem>
              <label>
                <input
                  type="radio"
                  name="hasTemporaryStorage"
                  checked={values.temporaryStorage == null}
                  onChange={() => {
                    setFieldValue("temporaryStorage", null);
                  }}
                />{" "}
                Non
              </label>
            </BsdListItem>
          </BsdList>
          {values.temporaryStorage ? (
            <BsdCompany name="temporaryStorage.company" />
          ) : (
            <BsdCompany name="recipient.company" />
          )}
          <BsdNextTreatmentOperation name="emitter.nextTreatmentOperation" />
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
            4. Mentions au titre des règlements ADR, RID, ADNR, IMDG (le cas
            échéant)
          </BsdLabel>
          <BsdList>
            <BsdListItem>
              <Field component={BsdInputField} type="text" name="waste.adr" />
            </BsdListItem>
          </BsdList>
        </BsdBoxColumn>
      </BsdBox>
      <BsdBox>
        <BsdBoxColumn>
          <BsdLabel>5. Conditionnement</BsdLabel>
          {values.temporaryStorage ? (
            <BsdPackages name="temporaryStorage.transporter.packages" />
          ) : (
            <BsdPackages name="recipient.transporter.packages" />
          )}
        </BsdBoxColumn>
      </BsdBox>
      <BsdBox>
        <BsdBoxColumn>
          <BsdLabel>6. Quantité</BsdLabel>
          {values.temporaryStorage ? (
            <BsdQuantity name="temporaryStorage.transporter.weight" />
          ) : (
            <BsdQuantity name="recipient.transporter.weight" />
          )}
        </BsdBoxColumn>
      </BsdBox>
      <BsdBox>
        <BsdBoxColumn>
          <BsdLabel>8. Collecteur-transporteur</BsdLabel>
          <BsdCompany name="recipient.transporter.company" />
          <BsdTransporterReceipt name="recipient.transporter.receipt" />
          {values.temporaryStorage ? (
            <>
              {values.temporaryStorage.transporter.signature ? (
                <BsdSignature
                  name="temporaryStorage.transporter.signature"
                  onCancel={() => {
                    setFieldValue(
                      "temporaryStorage.transporter.signature",
                      null
                    );
                  }}
                />
              ) : (
                <BsdList>
                  <BsdListItem>
                    <button
                      type="button"
                      onClick={() => {
                        const signature: Signature = {
                          author: values.temporaryStorage!.transporter.company
                            .contact,
                          date: new Date().toLocaleDateString(),
                        };
                        setFieldValue(
                          "temporaryStorage.transporter.signature",
                          signature
                        );
                      }}
                    >
                      Signer l'enlèvement
                    </button>
                  </BsdListItem>
                </BsdList>
              )}
            </>
          ) : (
            <>
              {values.recipient.transporter.signature ? (
                <BsdSignature
                  name="recipient.transporter.signature"
                  onCancel={() => {
                    setFieldValue("recipient.transporter.signature", null);
                  }}
                />
              ) : (
                <BsdList>
                  <BsdListItem>
                    <button
                      type="button"
                      onClick={() => {
                        const signature: Signature = {
                          author: values.recipient.transporter.company.contact,
                          date: new Date().toLocaleDateString(),
                        };
                        setFieldValue(
                          "recipient.transporter.signature",
                          signature
                        );
                      }}
                    >
                      Signer l'enlèvement
                    </button>
                  </BsdListItem>
                </BsdList>
              )}
            </>
          )}
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
              cadres ci-dessus sont exacts et établis de bonne foi
            </BsdListItem>
          </BsdList>
          {values.emitter.signature ? (
            <BsdSignature
              name="emitter.signature"
              onCancel={() => {
                setFieldValue("emitter.signature", null);
              }}
            />
          ) : (
            <BsdList>
              <BsdListItem>
                <button
                  type="button"
                  onClick={() => {
                    const signature: Signature = {
                      author: values.emitter.company.contact,
                      date: new Date().toLocaleDateString(),
                    };
                    setFieldValue("emitter.signature", signature);
                  }}
                >
                  Signer l'enlèvement
                </button>
              </BsdListItem>
            </BsdList>
          )}
        </BsdBoxColumn>
      </BsdBox>
      <BsdBox>
        <BsdBoxColumn>
          <BsdLabel>
            10. Expédition reçue à l’installation de destination
          </BsdLabel>
          <BsdCompany name="recipient.company" />
          {values.recipient.reception ? (
            <>
              <BsdList>
                <BsdListItem>
                  <label>
                    Quantité réelle présentée :{" "}
                    <Field
                      component={BsdInputField}
                      name="recipient.reception.weight.tons"
                    />
                  </label>
                </BsdListItem>
                <BsdListItem>
                  <label>
                    Date de présentation :{" "}
                    <Field
                      component={BsdInputField}
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
                      name="recipientRefusal"
                      checked={values.recipient.reception.refusal == null}
                      onChange={() => {
                        setFieldValue("recipient.reception.refusal", null);
                      }}
                    />{" "}
                    Oui
                  </label>
                </BsdListItem>
                <BsdListItem>
                  <label>
                    <input
                      type="radio"
                      name="recipientRefusal"
                      checked={values.recipient.reception.refusal != null}
                      onChange={() => {
                        setFieldValue(
                          "recipient.reception.refusal",
                          "Préciser la raison"
                        );
                      }}
                    />{" "}
                    Non
                  </label>
                </BsdListItem>
              </BsdList>
              {values.recipient.reception.refusal != null && (
                <BsdList>
                  <BsdListItem>
                    <label>
                      Motif de refus :{" "}
                      <Field
                        component={BsdInputField}
                        type="text"
                        name="recipient.reception.refusal"
                      />
                    </label>
                  </BsdListItem>
                </BsdList>
              )}
              {values.recipient.reception.signature ? (
                <BsdSignature
                  name="recipient.reception.signature"
                  onCancel={() => {
                    setFieldValue("recipient.reception.signature", null);
                  }}
                />
              ) : (
                <BsdList>
                  <BsdListItem>
                    <button
                      type="button"
                      onClick={() => {
                        const signature: Signature = {
                          author: values.recipient.company.contact,
                          date: new Date().toLocaleDateString(),
                        };
                        setFieldValue(
                          "recipient.reception.signature",
                          signature
                        );
                      }}
                    >
                      Signer la prise en charge
                    </button>
                  </BsdListItem>
                </BsdList>
              )}
              <BsdList>
                <BsdListItem>
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue("recipient.reception", null);
                    }}
                  >
                    Annuler la réception
                  </button>
                </BsdListItem>
              </BsdList>
            </>
          ) : (
            <BsdList>
              <BsdListItem>
                <button
                  type="button"
                  onClick={() => {
                    const reception: Reception = {
                      date: new Date().toLocaleDateString(),
                      refusal: null,
                      signature: null,
                      weight: {
                        type: WasteWeightType.Real,
                        tons:
                          values.temporaryStorage?.transporter.weight.tons ??
                          values.recipient.transporter.weight.tons,
                      },
                    };
                    setFieldValue("recipient.reception", reception);
                  }}
                >
                  Réceptionner le déchet
                </button>
              </BsdListItem>
            </BsdList>
          )}
        </BsdBoxColumn>
        <BsdBoxColumn>
          <BsdLabel>11. Réalisation de l’opération</BsdLabel>
          {values.recipient.treatment ? (
            <>
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
                <BsdListItem>
                  Je soussigné certifie que l’opération ci-dessus a été
                  effectuée
                </BsdListItem>
              </BsdList>
              <BsdSignature
                name="recipient.treatment.signature"
                onCancel={() => {
                  setFieldValue("recipient.treatment", null);
                }}
              />
            </>
          ) : (
            <BsdList>
              <BsdListItem>
                <button
                  type="button"
                  onClick={() => {
                    const treatment: Treatment = {
                      operation:
                        values.temporaryStorage?.nextTreatmentOperation ??
                        values.emitter.nextTreatmentOperation,
                      signature: {
                        author: values.recipient.company.contact,
                        date: new Date().toLocaleDateString(),
                      },
                    };
                    setFieldValue("recipient.treatment", treatment);
                  }}
                >
                  Signer la réalisation de l'opération
                </button>
              </BsdListItem>
            </BsdList>
          )}
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
              <BsdCompany name="temporaryStorage.company" />
              {values.temporaryStorage.reception ? (
                <>
                  <BsdList>
                    <BsdListItem>
                      Quantité présentée :{" "}
                      <label>
                        <Field
                          type="radio"
                          name="temporaryStorage.reception.weight.type"
                          value={WasteWeightType.Estimate}
                        />{" "}
                        Estimée
                      </label>{" "}
                      <label>
                        <Field
                          type="radio"
                          name="temporaryStorage.reception.weight.type"
                          value={WasteWeightType.Real}
                        />{" "}
                        Réelle
                      </label>{" "}
                      <Field
                        component={BsdInputField}
                        type="number"
                        name="temporaryStorage.reception.weight.tons"
                      />{" "}
                      tonne(s)
                    </BsdListItem>
                    <BsdListItem>
                      <label>
                        Date de présentation :{" "}
                        <Field
                          component={BsdInputField}
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
                          name="temporaryStorageRefusal"
                          checked={
                            values.temporaryStorage.reception.refusal == null
                          }
                          onChange={() => {
                            setFieldValue(
                              "temporaryStorage.reception.refusal",
                              null
                            );
                          }}
                        />{" "}
                        Oui
                      </label>
                    </BsdListItem>
                    <BsdListItem>
                      <label>
                        <input
                          type="radio"
                          name="temporaryStorageRefusal"
                          checked={
                            values.temporaryStorage.reception.refusal != null
                          }
                          onChange={() => {
                            setFieldValue(
                              "temporaryStorage.reception.refusal",
                              "Préciser la raison"
                            );
                          }}
                        />{" "}
                        Non
                      </label>
                    </BsdListItem>
                  </BsdList>
                  {values.temporaryStorage.reception.refusal != null && (
                    <BsdList>
                      <BsdListItem>
                        <label>
                          Motif de refus :{" "}
                          <Field
                            component={BsdInputField}
                            type="text"
                            name="temporaryStorage.reception.refusal"
                          />
                        </label>
                      </BsdListItem>
                    </BsdList>
                  )}
                  {values.temporaryStorage.reception.signature ? (
                    <BsdSignature
                      name="temporaryStorage.reception.signature"
                      onCancel={() => {
                        setFieldValue(
                          "temporaryStorage.reception.signature",
                          null
                        );
                      }}
                    />
                  ) : (
                    <BsdList>
                      <BsdListItem>
                        <button
                          type="button"
                          onClick={() => {
                            const signature: Signature = {
                              author: values.temporaryStorage!.company.contact,
                              date: new Date().toLocaleDateString(),
                            };
                            setFieldValue(
                              "temporaryStorage.reception.signature",
                              signature
                            );
                          }}
                        >
                          Signer la prise en charge
                        </button>
                      </BsdListItem>
                    </BsdList>
                  )}
                  <BsdList>
                    <BsdListItem>
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("temporaryStorage.reception", null);
                        }}
                      >
                        Annuler la réception
                      </button>
                    </BsdListItem>
                  </BsdList>
                </>
              ) : (
                <BsdList>
                  <BsdListItem>
                    <button
                      type="button"
                      onClick={() => {
                        const reception: Reception = {
                          date: new Date().toLocaleDateString(),
                          refusal: null,
                          signature: null,
                          weight: {
                            type: WasteWeightType.Estimate,
                            tons: values.recipient.transporter.weight.tons,
                          },
                        };
                        setFieldValue("temporaryStorage.reception", reception);
                      }}
                    >
                      Réceptionner le déchet
                    </button>
                  </BsdListItem>
                </BsdList>
              )}
            </BsdBoxColumn>
            <BsdBoxColumn>
              <BsdLabel>14. Installation de destination prévue</BsdLabel>
              <BsdCompany name="recipient.company" />
              <BsdNextTreatmentOperation name="temporaryStorage.nextTreatmentOperation" />
            </BsdBoxColumn>
          </BsdBox>
          <BsdBox>
            <BsdBoxColumn>
              <BsdLabel>16. Conditionnement</BsdLabel>
              <BsdPackages name="recipient.transporter.packages" />
            </BsdBoxColumn>
          </BsdBox>
          <BsdBox>
            <BsdBoxColumn>
              <BsdLabel>17. Quantité</BsdLabel>
              <BsdQuantity name="recipient.transporter.weight" />
            </BsdBoxColumn>
          </BsdBox>
          <BsdBox>
            <BsdBoxColumn>
              <BsdLabel>
                18. Collecteur-transporteur après entreposage ou
                reconditionnement
              </BsdLabel>
              <BsdCompany name="recipient.transporter.company" />
              <BsdTransporterReceipt name="recipient.transporter.receipt" />
              {values.recipient.transporter.signature ? (
                <BsdSignature
                  name="recipient.transporter.signature"
                  onCancel={() => {
                    setFieldValue("recipient.transporter.signature", null);
                  }}
                />
              ) : (
                <BsdList>
                  <BsdListItem>
                    <button
                      type="button"
                      onClick={() => {
                        const signature: Signature = {
                          author: values.recipient.transporter.company.contact,
                          date: new Date().toLocaleDateString(),
                        };
                        setFieldValue(
                          "recipient.transporter.signature",
                          signature
                        );
                      }}
                    >
                      Signer l'enlèvement
                    </button>
                  </BsdListItem>
                </BsdList>
              )}
            </BsdBoxColumn>
          </BsdBox>
          <BsdBox>
            <BsdBoxColumn>
              <BsdLabel>
                19. Déclaration de l’exploitant du site d’entreposage ou de
                reconditionnement
              </BsdLabel>
              <BsdList>
                <BsdListItem>
                  Je soussigné certifie que les renseignements portés ci-dessus
                  sont exacts et établis de bonne foi
                </BsdListItem>
              </BsdList>
              {values.temporaryStorage.signature ? (
                <BsdSignature
                  name="temporaryStorage.signature"
                  onCancel={() => {
                    setFieldValue("temporaryStorage.signature", null);
                  }}
                />
              ) : (
                <BsdList>
                  <BsdListItem>
                    <button
                      type="button"
                      onClick={() => {
                        const signature: Signature = {
                          author: values.temporaryStorage!.company.contact,
                          date: new Date().toLocaleDateString(),
                        };
                        setFieldValue("temporaryStorage.signature", signature);
                      }}
                    >
                      Signer l'enlèvement
                    </button>
                  </BsdListItem>
                </BsdList>
              )}
            </BsdBoxColumn>
          </BsdBox>
        </>
      )}
    </BsdContainer>
  );
}
