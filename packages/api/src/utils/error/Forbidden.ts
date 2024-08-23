import GeneralError, { type Error } from './GeneralError';

// -> erro de permissao [sem acesso ao recurso]
class Forbidden extends GeneralError {
  constructor(error: Error) {
    super(error, 403);
  }
}

export default Forbidden;
