import type { IQuote } from '@src/server/storage';
import { tokensIDS } from './assets-token/addresses';

export type IAsset = {
  symbol: string;
  slug?: string;
  id: string;
};

export type IAssetMapById = {
  [id: string]: {
    symbol: string;
    slug?: string;
  };
};

export type IAssetMapBySymbol = {
  [symbol: string]: {
    slug?: string;
    id: string;
  };
};

export const assets: IAsset[] = [
  {
    symbol: 'ETH',
    slug: 'ethereum',
    id: tokensIDS.ETH,
  },
  {
    symbol: 'BTC',
    slug: 'bitcoin',
    id: tokensIDS.BTC,
  },
  {
    symbol: 'USDC',
    slug: 'usd-coin',
    id: tokensIDS.USDC,
  },
  {
    symbol: 'UNI',
    slug: 'uniswap',
    id: tokensIDS.UNI,
  },
  {
    symbol: 'DAI',
    id: tokensIDS.DAI,
  },
  {
    symbol: 'sETH',
    id: tokensIDS.sETH,
  },
];

export const assetsMapById: IAssetMapById = assets.reduce(
  (previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.id]: {
        symbol: currentValue.symbol,
        slug: currentValue.slug,
      },
    };
  },
  {},
);

export const assetsMapBySymbol: IAssetMapBySymbol = assets.reduce(
  (previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.symbol]: {
        slug: currentValue.slug,
        id: currentValue.id,
      },
    };
  },
  {},
);

export const QuotesMock: IQuote[] = [
  {
    assetId: assetsMapBySymbol.ETH.id,
    price: 3381.1556815779345,
  },
  {
    assetId: assetsMapBySymbol.BTC.id,
    price: 61620.37310293032,
  },
  {
    assetId: assetsMapBySymbol.USDC.id,
    price: 0.9998584312603784,
  },
  {
    assetId: assetsMapBySymbol.UNI.id,
    price: 9.379567369214598,
  },
];
