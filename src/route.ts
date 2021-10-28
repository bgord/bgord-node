import express from 'express';
import asyncHandler from 'express-async-handler';

export function Route(fn: express.RequestHandler) {
  return asyncHandler(fn);
}
