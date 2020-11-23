import * as React from "react";
import { Field } from "formik";
import { BsdList, BsdListItem, BsdInputField } from "../components";

interface BsdCompanyProps {
  name: string;
}

export function BsdCompany({ name }: BsdCompanyProps) {
  return (
    <BsdList>
      <BsdListItem>
        <label>
          N° SIRET :{" "}
          <Field component={BsdInputField} type="text" name={`${name}.siret`} />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Nom :{" "}
          <Field component={BsdInputField} type="text" name={`${name}.name`} />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Adresse :{" "}
          <Field
            component={BsdInputField}
            type="text"
            name={`${name}.address`}
          />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Tél :{" "}
          <Field component={BsdInputField} type="text" name={`${name}.phone`} />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Mél :{" "}
          <Field component={BsdInputField} type="text" name={`${name}.email`} />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Personne à contacter :{" "}
          <Field
            component={BsdInputField}
            type="text"
            name={`${name}.contact`}
          />
        </label>
      </BsdListItem>
    </BsdList>
  );
}
