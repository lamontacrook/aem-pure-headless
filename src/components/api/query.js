import { TeaserGQL } from '../teaser';

export const ScreenQry = () => {
  return `{
    screen: screenList {
      body: items {
        _model {
          title
        }
        block {
          ${TeaserGQL}
      }
    }
  }`;
};

export const Nav = () => {
  return `{
    {
      screenList(filter: {
        positionInNavigation: {
          _expressions: [{
            value: "dni",
            _operator: CONTAINS_NOT
          }]
        }
      }) {
        items {
          screenName
          positionInNavigation
        }
      }
    }
  }`;
};
