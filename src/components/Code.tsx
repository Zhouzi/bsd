import styled, { css } from "styled-components";

export const CodeContainer = styled.pre`
  padding: 1rem 0;
  font-family: "Source Code Pro", monospace;
  margin: 0 0 0.5rem 0;
`;
export const CodeLine = styled.div<{
  variant: "added" | "removed" | "unchanged";
}>`
  padding: 0 1rem;

  ${(props) => {
    switch (props.variant) {
      case "added":
        return css`
          background-color: #197546;
        `;
      case "removed":
        return css`
          background-color: #ab3939;
        `;
      case "unchanged":
      default:
        return css``;
    }
  }}
`;
