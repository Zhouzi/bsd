import styled, { css } from "styled-components";

export const ScenarioItem = styled.article`
  padding: 1rem 1rem 2rem 1rem;
`;
export const ScenarioItemName = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
  font-weight: bold;
`;
export const ScenarioItemDescription = styled.small`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;
export const ScenarioItemStepList = styled.ol`
  margin: 0;
  padding: 0 0 0 1rem;
`;
export const ScenarioItemStepListItem = styled.li.attrs({
  role: "button",
  tabIndex: 0,
})<{ active: boolean }>`
  cursor: pointer;
  color: #1d68f3;
  text-decoration: underline;
  outline: none;

  ${(props) =>
    props.active &&
    css`
      font-weight: bold;
      text-decoration: none;
    `}
`;
