import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { h } from 'react-hyperscript-helpers';

import { SearchTokenChip, QueryHitsDiv } from '../search-token-chip';

describe('SearchTokenChip', () => {
  context('when no results', () => {
    it('should not render', () => {
      const resultsExist = false;
      const wrapper = shallow(h(SearchTokenChip, { resultsExist }));
      expect(toJson(wrapper)).toBe('');
    });
  });
  context('when no tokens but results exist', () => {
    it('should render without category', () => {
      const resultsExist = true;
      const tokensForWords = [];
      const wrapper = shallow(
        h(SearchTokenChip, { resultsExist, tokensForWords }),
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  context('when tokens grouped by word and results exist', () => {
    it('category is rendered', () => {
      const resultsExist = true;
      const tokensForWords = [
        [{ token: 'Eric', categoryTitle: 'Name' }],
        [
          { token: 'Trove', categoryTitle: 'Company Name' },
          { token: 'Trove', categoryTitle: 'Domain' },
        ],
      ];
      const wrapper = shallow(
        h(SearchTokenChip, { resultsExist, tokensForWords }),
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  context('when only 1 result', () => {
    it('should render singular verbiage', () => {
      const resultsExist = true;
      const resultsLength = 1;
      const wrapper = shallow(
        h(SearchTokenChip, { resultsExist, resultsLength }),
      );
      expect(
        wrapper
          .find(QueryHitsDiv)
          .dive()
          .text(),
      ).toBe('1 result');
    });
  });

  context('when multiple results', () => {
    it('should render plural verbiage', () => {
      const resultsExist = true;
      const resultsLength = 42;
      const wrapper = shallow(
        h(SearchTokenChip, { resultsExist, resultsLength }),
      );
      expect(
        wrapper
          .find(QueryHitsDiv)
          .dive()
          .text(),
      ).toBe('42 results');
    });
  });
});
