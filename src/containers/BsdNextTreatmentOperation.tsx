import * as React from "react";
import { Field } from "formik";
import { BsdList, BsdListItem, BsdInputField } from "../components";

interface BsdNextTreatmentOperationProps {
  name: string;
}

export function BsdNextTreatmentOperation({
  name,
}: BsdNextTreatmentOperationProps) {
  return (
    <BsdList>
      <BsdListItem>
        <label>
          Opération d'élminitation prévue :{" "}
          <Field component={BsdInputField} type="text" name={`${name}.code`} />
        </label>
      </BsdListItem>
    </BsdList>
  );
}
