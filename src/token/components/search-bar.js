import { Component } from 'react';
import lodash from 'lodash';
const { debounce } = lodash;
import { h } from 'react-hyperscript-helpers';
import { connect } from 'react-redux';

import { HighlightedSearchTokens } from './highlighted-search-tokens';
import {
  setConnectSearchQuery,
  searchConnect,
  updateSelectedToken,
} from '../action-creators';
import { getSortedTokens } from '../selectors';
import { MIN_QUERY_LENGTH } from '../constants';

export const AUTO_SEARCH_DELAY = 2000;
export const RESUBMIT_DELAY = 2000;

const noop = () => {};

export class SearchBar extends Component {
  static defaultProps = {
    setQuery: noop,
    submitQuery: noop,
    submitQueryAfterDelay: noop,
    updateToken: noop,
    tokens: [],
    defaultQuery: '',
    disableTyping: false,
  };

  componentWillMount() {
    this.setState({ query: this.props.defaultQuery });
  }

  state = {
    query: '',
  };

  setLocalQuery = (newQuery, shouldAutoSearch = true) => {
    const { setQuery, submitQuery, submitQueryAfterDelay } = this.props;

    this.setState({ query: newQuery });
    setQuery(newQuery);

    if (newQuery.length >= MIN_QUERY_LENGTH) {
      if (shouldAutoSearch) {
        submitQueryAfterDelay(newQuery);
      } else {
        submitQuery(newQuery);
        submitQueryAfterDelay.cancel();
      }
    } else {
      submitQueryAfterDelay.cancel();
    }
  };

  render() {
    const { query } = this.state;
    const { tokens, disableTyping, updateToken } = this.props;
    return h(HighlightedSearchTokens, {
      updateToken,
      query,
      handleSearch: this.setLocalQuery,
      tokens,
      disableTyping,
    });
  }
}

function mapStateToProps(state) {
  return {
    tokens: getSortedTokens(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setQuery: (query) => dispatch(setConnectSearchQuery({ query })),
    submitQuery: debounce(
      (query) => {
        dispatch(searchConnect({ query }));
      },
      RESUBMIT_DELAY,
      { leading: true },
    ),
    submitQueryAfterDelay: debounce((query) => {
      dispatch(searchConnect({ query }));
    }, AUTO_SEARCH_DELAY),
    updateToken: (selectedToken, updatedToken) =>
      dispatch(
        updateSelectedToken({
          selectedToken,
          updatedToken,
        }),
      ),
  };
}

export const SearchBarConn = connect(mapStateToProps, mapDispatchToProps)(
  SearchBar,
);
