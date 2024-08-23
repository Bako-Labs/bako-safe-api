import GeneralError, { type Error } from './GeneralError';

class BadRequest extends GeneralError {
  constructor(error: Error) {
    super(error, 400);
  }
}

export default BadRequest;
