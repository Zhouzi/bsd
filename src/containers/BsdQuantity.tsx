import * as React from "react";
import { Field } from "formik";
import { WasteWeightType } from "../types";
import { BsdList, BsdListItem, BsdInputField } from "../components";

interface BsdQuantityProps {
  name: string;
}

export function BsdQuantity({ name }: BsdQuantityProps) {
  return (
    <BsdList orientation="horizontal">
      <BsdListItem>
        <label>
          <Field
            type="radio"
            name={`${name}.type`}
            value={WasteWeightType.Estimate}
          />{" "}
          Estimée
        </label>
      </BsdListItem>
      <BsdListItem>
        <label>
          <Field
            type="radio"
            name={`${name}.type`}
            value={WasteWeightType.Real}
          />{" "}
          Réelle
        </label>
      </BsdListItem>
      <BsdListItem>
        <Field component={BsdInputField} type="number" name={`${name}.tons`} />{" "}
        tonne(s)
      </BsdListItem>
    </BsdList>
  );
}
