import {
  type IAsset,
  QuotesMock,
  assets,
  assetsMapById,
  assetsMapBySymbol,
  isDevMode,
} from '@src/utils';
import axios from 'axios';

const { COIN_MARKET_CAP_API_KEY } = process.env;

export interface IQuote {
  assetId: string;
  price: number;
}

const REFRESH_TIME = 1000 * 60 * 15; // 10 minutes

export class QuoteStorage {
  private data = new Map<string, number>();

  protected constructor() {
    this.data = new Map<string, number>();
  }

  public getQuote(assetId: string): number {
    const quote = this.data.get(assetId);
    return quote ?? 0;
  }

  private setQuote(assetId: string, price: number): void {
    this.data.set(assetId, price);
  }

  private addMockQuotes(): void {
    QuotesMock?.forEach((quote) => {
      this.setQuote(quote.assetId, quote.price);
    });
  }

  private async addQuotes(): Promise<void> {
    if (isDevMode) {
      this.addMockQuotes();
      return;
    }

    const params = this.generateParams(assets);

    if (params) {
      const quotes = await this.fetchQuotes(params);

      quotes.forEach((quote) => {
        this.setQuote(quote.assetId, quote.price);
      });
    }
  }

  private generateParams(assets?: IAsset[]): string {
    if (!assets) return '';

    const params = assets.reduce((acc, asset) => {
      const _asset = assetsMapById[asset.id];

      if (_asset?.slug) {
        acc += (acc ? ',' : '') + _asset.slug;
      }

      return acc;
    }, '');

    return params;
  }

  private async fetchQuotes(params: string): Promise<IQuote[]> {
    try {
      const { data } = await axios.get(
        'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest',
        {
          params: {
            slug: params,
          },
          headers: { 'X-CMC_PRO_API_KEY': COIN_MARKET_CAP_API_KEY },
        },
      );

      // console.log('[REQUEST_QUOTE] auth: ', COIN_MARKET_CAP_API_KEY)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData = Object.values(data.data).map((item: any) => ({
        assetId: assetsMapBySymbol[item.symbol].id,
        price: item.quote.USD.price,
      }));

      return formattedData;
    } catch (_e) {
      // console.log('[STORAGE_QUOTE] Get quots value: ', e);
      return [];
    }
  }

  public getActiveQuotes() {
    return Array.from(this.data).length;
  }

  public getActiveQuotesValues() {
    return Array.from(this.data);
  }

  static start() {
    const _this = new QuoteStorage();
    _this.addQuotes();

    setInterval(() => {
      _this.addQuotes();
    }, REFRESH_TIME);

    return _this;
  }
}
