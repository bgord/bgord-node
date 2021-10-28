import express from 'express';
import asyncHandler from 'express-async-handler';

export function Middleware(fn: express.RequestHandler) {
  return asyncHandler(fn);
}
