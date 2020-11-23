import * as React from "react";
import { Field } from "formik";
import { BsdList, BsdListItem, BsdInputField } from "../components";

interface BsdSignatureProps {
  name: string;
  onCancel: () => void;
}

export function BsdSignature({ name, onCancel }: BsdSignatureProps) {
  return (
    <BsdList>
      <BsdListItem>
        <label>
          Date :{" "}
          <Field component={BsdInputField} type="text" name={`${name}.date`} />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Signature :{" "}
          <Field
            component={BsdInputField}
            type="text"
            name={`${name}.author`}
          />
        </label>
      </BsdListItem>
      <BsdListItem>
        <button type="button" onClick={onCancel}>
          Annuler la signature
        </button>
      </BsdListItem>
    </BsdList>
  );
}
