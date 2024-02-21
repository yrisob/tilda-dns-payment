import type { Schema, Attribute } from '@strapi/strapi';

export interface MultiLaguagesMultiDescription extends Schema.Component {
  collectionName: 'components_multi_laguages_multi_descriptions';
  info: {
    displayName: 'multi_description';
    icon: 'earth';
  };
  attributes: {
    en: Attribute.Blocks;
    ja: Attribute.Blocks;
  };
}

export interface MultiLaguagesMultiTitle extends Schema.Component {
  collectionName: 'components_multi_laguages_multi_titles';
  info: {
    displayName: 'multi_title';
    icon: 'earth';
  };
  attributes: {
    en: Attribute.String;
    ja: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'multi-laguages.multi-description': MultiLaguagesMultiDescription;
      'multi-laguages.multi-title': MultiLaguagesMultiTitle;
    }
  }
}
