import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { h } from 'react-hyperscript-helpers';
import { SearchToken } from '../../components/search-token';
import { NEW_TOKEN_CATEGORY } from '../../constants';

describe('SearchToken', () => {
  it('should render', () => {
    const wrapper = shallow(h(SearchToken));
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('when token category is company', () => {
    it('orange highlight is rendered with contextMenu only', () => {
      const token = { token: 'Trove', category: 'company' };

      const wrapper = shallow(h(SearchToken, { token }));
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('when token category is new token', () => {
    it('clickable highlight is rendered without a background-color', () => {
      const token = { token: 'Trove', category: NEW_TOKEN_CATEGORY };

      const wrapper = shallow(h(SearchToken, { token }));
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
