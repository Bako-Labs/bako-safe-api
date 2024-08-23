import GeneralError, { type Error } from './GeneralError';

class NotFound extends GeneralError {
  constructor(error: Error) {
    super(error, 404);
  }
}

export default NotFound;
