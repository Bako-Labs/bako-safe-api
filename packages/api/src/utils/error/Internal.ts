import GeneralError, { type Error, ErrorTypes } from './GeneralError';

// -> erro de permissao [sem acesso ao recurso]
class Internal extends GeneralError {
  constructor(error: Error) {
    super(error, 500);
  }

  static handler = (e, title: string) => {
    if (e instanceof GeneralError) throw e;

    throw new Internal({
      type: ErrorTypes.Internal,
      title,
      detail: e,
    });
  };
}

export default Internal;
