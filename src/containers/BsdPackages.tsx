import * as React from "react";
import { FieldArray, Field, useField } from "formik";
import { TransporterPackage, TransporterPackageType } from "../types";
import { BsdList, BsdListItem, BsdInputField } from "../components";

interface BsdPackagesProps {
  name: string;
}

export function BsdPackages({ name }: BsdPackagesProps) {
  const [field] = useField<TransporterPackage[]>(name);

  return (
    <FieldArray name={name}>
      {({ remove, push }) => (
        <>
          {field.value.map((_, index) => (
            <BsdList key={index} orientation="horizontal">
              <BsdListItem>
                <label>
                  Nombre :{" "}
                  <Field
                    component={BsdInputField}
                    type="number"
                    name={`${name}.${index}.quantity`}
                  />
                </label>
              </BsdListItem>
              <BsdListItem>
                <label>
                  <Field
                    type="radio"
                    name={`${name}.${index}.type`}
                    value={TransporterPackageType.Benne}
                  />{" "}
                  Benne
                </label>
              </BsdListItem>
              <BsdListItem>
                <label>
                  <Field
                    type="radio"
                    name={`${name}.${index}.type`}
                    value={TransporterPackageType.Citerne}
                  />{" "}
                  Citerne
                </label>
              </BsdListItem>
              <BsdListItem>
                <label>
                  <Field
                    type="radio"
                    name={`${name}.${index}.type`}
                    value={TransporterPackageType.Fut}
                  />{" "}
                  Fût
                </label>
              </BsdListItem>
              <BsdListItem>
                <label>
                  <Field
                    type="radio"
                    name={`${name}.${index}.type`}
                    value={TransporterPackageType.GRV}
                  />{" "}
                  GRV
                </label>
              </BsdListItem>
              <BsdListItem>
                <label>
                  <Field
                    type="radio"
                    name={`${name}.${index}.type`}
                    value={TransporterPackageType.Other}
                  />{" "}
                  Autre
                </label>
              </BsdListItem>
              <BsdListItem>
                <button
                  type="button"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  Retirer
                </button>
              </BsdListItem>
            </BsdList>
          ))}
          <BsdList>
            <BsdListItem>
              <button
                type="button"
                onClick={() => {
                  const newPackage: TransporterPackage = {
                    quantity: 1,
                    type: TransporterPackageType.Other,
                  };
                  push(newPackage);
                }}
              >
                Ajouter
              </button>
            </BsdListItem>
          </BsdList>
        </>
      )}
    </FieldArray>
  );
}
