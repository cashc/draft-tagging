import { shallow } from 'enzyme';
import { h } from 'react-hyperscript-helpers';

import { ChooseTokenCategory } from '../choose-token-category';

describe('ChooseTokenCategory', () => {
  describe('selected token', () => {
    const selectedToken = { token: 'world', start: 7, end: 12, category: 'new_token' };
    const wrapper = shallow(h(ChooseTokenCategory, { selectedToken }));

    it('should render the menu', () => {
      expect(wrapper.children().length).toBe(7);
    });
  });

  describe('no selected token', () => {
    const wrapper = shallow(h(ChooseTokenCategory));

    it('should render the menu', () => {
      expect(wrapper.html()).toBe(null);
    });
  });
});
