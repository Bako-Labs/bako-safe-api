import { predicateVersionMock } from '@src/mocks/predicateVersion';
import axios from 'axios';

const { API_URL } = process.env;

describe('[PREDICATE VERSION]', () => {
  let api = beforeAll(() => {
    api = axios.create({
      baseURL: API_URL,
    });
  });

  test('Find current predicate version', async () => {
    await api.get('/predicate/version/current').then(({ data, status }) => {
      expect(status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('description');
      expect(data).toHaveProperty('code');
      expect(data).toHaveProperty('abi');
      expect(data).toHaveProperty('bytes');
      expect(data).toHaveProperty('active');
    });
  });

  test('List predicate versions', async () => {
    //with pagination
    const page = 0;
    const perPage = 10;
    await api
      .get(`/predicate/version?page=${page}&perPage=${perPage}`)
      .then(({ data, status }) => {
        expect(status).toBe(200);
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('total');
        expect(data).toHaveProperty('currentPage', page);
        expect(data).toHaveProperty('perPage', perPage);
        expect(data.data.length).toBeLessThanOrEqual(perPage);
        data.data.forEach((element) => {
          expect(element).toHaveProperty('id');
          expect(element).toHaveProperty('name');
          expect(element).toHaveProperty('description');
          expect(element).toHaveProperty('code');
          expect(element).toHaveProperty('abi');
          expect(element).toHaveProperty('bytes');
          expect(element).toHaveProperty('active');
        });
      });

    //without pagination
    await api.get('/predicate/version').then(({ data, status }) => {
      expect(status).toBe(200);
      data.forEach((element) => {
        expect(element).toHaveProperty('id');
        expect(element).toHaveProperty('name');
        expect(element).toHaveProperty('description');
        expect(element).toHaveProperty('code');
        expect(element).toHaveProperty('abi');
        expect(element).toHaveProperty('bytes');
        expect(element).toHaveProperty('active');
      });
    });
  });

  test('Find predicate version by code', async () => {
    await api
      .get(`/predicate/version/${predicateVersionMock.code}`)
      .then(({ data, status }) => {
        expect(status).toBe(200);
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('name', predicateVersionMock.name);
        expect(data).toHaveProperty('description', null);
        expect(data).toHaveProperty('code', predicateVersionMock.code);
        expect(data).toHaveProperty('abi', predicateVersionMock.abi);
        expect(data).toHaveProperty('bytes', predicateVersionMock.bytes);
        expect(data).toHaveProperty('active', true);
      });
  });
});
