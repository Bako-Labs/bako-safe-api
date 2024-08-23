import type express from 'express';

export const handleErrorMiddleware = (
  error: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) => {
  console.log(error);
  return res.status(200).json({
    data: null,
    errors: [
      {
        message: error.message,
        locations: 'locations' in error ? error.locations : [],
        path: 'path' in error ? error.path : null,
      },
    ],
  });
};
