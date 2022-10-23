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


