import { h } from 'react-hyperscript-helpers';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { SearchBar } from '../../components/search-bar';

jest.useFakeTimers();

describe('when defaultQuery is supplied to SearchBar', () => {
  it('should set the query state to the defaultQuery', () => {
    const query = 'Hi there does this work?';
    const wrapper = shallow(h(SearchBar, { defaultQuery: query }), {
      experimentalLifecycle: true,
    });

    expect(wrapper.state('query')).toEqual(query);
  });
});

describe('default SearchBar render', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(h(SearchBar));
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('when disableTyping is `true`', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(h(SearchBar, { disableTyping: true }));
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('SearchBar search', () => {
  it('should not submit query when query < MIN_QUERY_LENGTH', () => {
    const setQuery = jest.fn();
    const submitQuery = jest.fn();
    const submitQueryAfterDelay = { cancel: jest.fn() };
    const wrapper = shallow(
      h(SearchBar, { setQuery, submitQuery, submitQueryAfterDelay }),
    );
    wrapper.instance().setLocalQuery('i');

    expect(setQuery).toHaveBeenCalled();
    expect(submitQueryAfterDelay.cancel).toHaveBeenCalled();
    expect(submitQuery).not.toHaveBeenCalled();
  });

  describe('autosearch set to true', () => {
    it('should submit query when query >= MIN_QUERY_LENGTH', () => {
      const setQuery = jest.fn();
      const submitQuery = jest.fn();
      const submitQueryAfterDelay = jest.fn();
      const wrapper = shallow(
        h(SearchBar, { setQuery, submitQuery, submitQueryAfterDelay }),
      );
      wrapper.instance().setLocalQuery('ivan');

      expect(setQuery).toHaveBeenCalled();
      expect(submitQueryAfterDelay).toHaveBeenCalled();
      expect(submitQuery).not.toHaveBeenCalled();
    });
  });

  describe('autosearch set to false', () => {
    it('should submit query when query >= MIN_QUERY_LENGTH', () => {
      const setQuery = jest.fn();
      const submitQuery = jest.fn();
      const submitQueryAfterDelay = { cancel: jest.fn() };
      const wrapper = shallow(
        h(SearchBar, { setQuery, submitQuery, submitQueryAfterDelay }),
      );
      wrapper.instance().setLocalQuery('ivan', false);

      expect(setQuery).toHaveBeenCalled();
      expect(submitQueryAfterDelay.cancel).toHaveBeenCalled();
      expect(submitQuery).toHaveBeenCalled();
    });
  });
});
