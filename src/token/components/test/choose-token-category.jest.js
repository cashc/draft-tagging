import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { h } from 'react-hyperscript-helpers';

import { ChooseTokenCategory } from '../choose-token-category';

describe('ChooseTokenCategory', () => {
  describe('when rendering', () => {
    const wrapper = shallow(h(ChooseTokenCategory));
    const json = toJson(wrapper);

    it('should render the menu', () => {
      expect(json).toMatchSnapshot();
    });
  });
});
