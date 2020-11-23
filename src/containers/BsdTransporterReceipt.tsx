import * as React from "react";
import { Field } from "formik";
import { BsdList, BsdListItem, BsdInputField } from "../components";

interface BsdTransporterReceiptProps {
  name: string;
}

export function BsdTransporterReceipt({ name }: BsdTransporterReceiptProps) {
  return (
    <BsdList>
      <BsdListItem>
        <label>
          Récépissé n° :{" "}
          <Field
            component={BsdInputField}
            type="text"
            name={`${name}.number`}
          />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Département :{" "}
          <Field
            component={BsdInputField}
            type="text"
            name={`${name}.department`}
          />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Limite de validité :{" "}
          <Field
            component={BsdInputField}
            type="text"
            name={`${name}.expiresAt`}
          />
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          Mode de transport :{" "}
          <Field component={BsdInputField} type="text" name={`${name}.mode`} />
        </label>
      </BsdListItem>
    </BsdList>
  );
}
