import { shallow } from 'enzyme';
import { h } from 'react-hyperscript-helpers';

import { SearchTokenChip } from '../search-token-chip';

describe('SearchTokenChip', () => {
  describe('when no results', () => {
    it('should not render', () => {
      const wrapper = shallow(h(SearchTokenChip));
      expect(wrapper.children().length).toBe(1);
    });
  });

  describe('when tokens grouped by word and results exist', () => {
    it('category is rendered', () => {
      const tokensForWords = [
        [{ token: 'Eric', categoryTitle: 'Name' }],
        [
          { token: 'Trove', categoryTitle: 'Company Name' },
          { token: 'Trove', categoryTitle: 'Domain' },
        ],
      ];
      const wrapper = shallow(
        h(SearchTokenChip, { tokensForWords }),
      );
      expect(wrapper.childAt(1).html()).toMatch(/.*Eric.*Name/);
      expect(wrapper.childAt(2).html()).toMatch(/.*Trove.*Company.*Domain/);
    });
  });
});
