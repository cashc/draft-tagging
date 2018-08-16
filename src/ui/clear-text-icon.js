import { h } from 'react-hyperscript-helpers';
import styled from 'styled-components';

import InjectSVG from './svg';

export const StyledSvg = styled(InjectSVG)`
  svg {
    background-color: ${(props) => props.theme.backgroundDisabled};
    border-radius: 50%;
    transform: scale(0.7);
  }

  .icon-shape {
    transform: scale(0.7);
    transform-origin: 50%;
  }
`;

export function ClearTextIcon({ onClick }) {
  return h(StyledSvg, { onClick, path: 'ic-cancel-black-32.svg' });
}
