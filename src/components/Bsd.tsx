import * as React from "react";
import styled, { css } from "styled-components";
import AutosizeInput from "react-input-autosize";
import { FieldProps } from "formik";

export const BsdContainer = styled.div`
  border-bottom: 1px solid #161c4e;
  margin: 1rem;
`;
export const BsdBox = styled.div`
  border: 1px solid #161c4e;
  border-right: 0;
  border-bottom: 0;
  display: flex;
`;
export const BsdBoxColumn = styled.div`
  flex: 1;
  border-right: 1px solid #161c4e;
  padding: 0.5rem;
`;
export const BsdLabel = styled.label`
  display: block;
  width: 100%;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;
const BsdInput = styled(AutosizeInput).attrs({ placeholder: " ".repeat(20) })`
  & input {
    font: inherit;
    font-family: "Pangolin", cursive;
    color: inherit;
    padding: 0;
    border: 0;
    background-color: #f6f7ff;

    &:not(:focus) {
      cursor: pointer;
    }
  }
`;
export function BsdInputField({
  field: { value, ...field },
  form,
  ...props
}: FieldProps) {
  return <BsdInput value={value ?? ""} {...field} {...props} />;
}

export const BsdList = styled.ul<{ orientation?: "horizontal" | "vertical" }>`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;

  ${(props) => {
    switch (props.orientation) {
      case "horizontal":
        return css`
          display: flex;
        `;
      case "vertical":
      default:
        return css`
           ;
        `;
    }
  }}
`;
export const BsdListItem = styled.li`
  margin: 0 0.5rem 0.25rem 0;
`;
