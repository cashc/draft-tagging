import { Component } from 'react';
import { connect } from 'react-redux';
import { h } from 'react-hyperscript-helpers';
import styled from 'styled-components';

import { InjectSVG } from '../../ui';
import { NEW_TOKEN_CATEGORY } from '../constants';
import { openModal, setSelectedToken } from '../action-creators';

const SearchBarToken = styled.span`
  border-radius: 2px;
  background-color: ${(props) => props.theme.infoBackground};

  > .handlebar {
    display: none;
    position: absolute;

    > svg {
      width: 6px;
      height: 21px;
    }

    > svg * {
      fill: ${(props) => props.theme.brandPrimary};
    }
  }

  &:hover > div {
    display: inline-block;
  }

  > .left {
    margin-left: -2px;
  }

  > .right {
    margin-top: 2px;
    margin-left: -4px;
  }
`;

const NewSearchBarToken = SearchBarToken.extend`
  cursor: pointer;
  border: 1px solid;
  background-color: none;
`;

const DraggableHandleBase = styled.div`
  position: absolute;
  height: 24px;
  width: 9px;
  cursor: pointer;
  user-select: none;
  display: none;
`;

const DraggableHandleLeft = DraggableHandleBase.extend`
  margin-left: -2px;
`;

const DraggableHandleRight = DraggableHandleBase.extend`
  margin-top: 2px;
  margin-left: -4px;
`;

type Props = {
  token: Object,
  children: Array<Object>,
  chooseTokenCategory: Function,
  onHandleMouseDown: Function,
};

export class SearchToken extends Component {
  props: Props;

  static defaultProps = {
    token: {},
    children: [],
    chooseTokenCategory: () => {},
    onHandleMouseDown: () => {},
  };

  onStart = (ev, isLeft) => {
    ev.stopPropagation();
    const { token, onHandleMouseDown } = this.props;
    onHandleMouseDown(isLeft, token);
  };

  render() {
    const { token, children, chooseTokenCategory } = this.props;

    if (token.category === NEW_TOKEN_CATEGORY) {
      return h(
        NewSearchBarToken,
        { onClick: (ev) => chooseTokenCategory(ev, token) },
        children,
      );
    }

    return h(SearchBarToken, { onClick: (ev) => stopEvent(ev) }, [
      h(InjectSVG, {
        path: 'text-handle-start.svg',
        containerClassName: 'handlebar left',
      }),
      h(DraggableHandleLeft, { onMouseDown: (ev) => this.onStart(ev, true) }),
      ...children,
      h(InjectSVG, {
        path: 'text-handle-end.svg',
        containerClassName: 'handlebar right',
      }),
      h(DraggableHandleRight, { onMouseDown: (ev) => this.onStart(ev, false) }),
    ]);
  }
}

const stopEvent = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();
};

const mapDispatchToProps = (dispatch) => ({
  chooseTokenCategory: (ev, selectedToken) => {
    stopEvent(ev);
    dispatch(setSelectedToken({ selectedToken }));
    dispatch(openModal({ selectedToken }));
  },
});

export const SearchTokenConn = connect(null, mapDispatchToProps)(SearchToken);
