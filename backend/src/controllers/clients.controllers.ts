import { type NextFunction, type Request, type Response } from 'express';
import { paginationSchema } from '../utils/pagination.js';
import { 
  createClientService, 
  getClientsService,
  searchClientService,
  updateClientService,
  deleteClientService,
 } from '../services/clients.services.js';
import {
  createClientSchema,
  updateClientSchema,
  clientIdSchema,
  searchClientSchema,
} from '../validation/clients.validation.js'
import { z } from 'zod'
import { AppError } from '../utils/AppError.js';
import { requireAuthenticatedUser } from '../auth/requireAuthenticated.js';

export async function createClient( req: Request, res: Response, next: NextFunction) {
  try {

    const body = createClientSchema.parse(req.body);

    const user = requireAuthenticatedUser(req);

    const client = await createClientService(body, user.id);

    res.status(201).json(client);
  } catch(error) {
    next(error)
  }
}

export async function getClients(req: Request, res: Response, next: NextFunction) {
  try {

    const query = paginationSchema.parse(req.query);

    const user = requireAuthenticatedUser(req)

    const clients = await getClientsService(query, user.id);

    res.status(200).json(clients);

  } catch(error) {
    next(error);
  }
}

export async function searchClient(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {

    const {filter, value} = searchClientSchema.parse(req.query);

    const user = requireAuthenticatedUser(req)

    let searchValue: string | number = value;

    if (filter === 'id') {
      searchValue = z.coerce.number().int().min(1).parse(value);
    }

    const client = await searchClientService(
      filter,
      searchValue,
      user.id
    );

    if (!client) {
      throw new AppError('client not found', 404)
    }

    res.status(200).json(client);

  } catch (error) {
    next(error);
  }
}

export async function updateClient(req: Request, res: Response, next: NextFunction) {
  try {
    const id = clientIdSchema.parse(req.params.id);

    const body = updateClientSchema.parse(req.body);

    const user = requireAuthenticatedUser(req)

    const client = await updateClientService(id, user.id, body);

    res.status(200).json(client);

  } catch(error) {
    next(error)
  }
}

export async function deleteClient(req: Request, res: Response, next: NextFunction) {
  try {

  const id = clientIdSchema.parse(req.params.id);

  const user = requireAuthenticatedUser(req)

  const client = await deleteClientService(id, user.id);

  res.status(200).json(client);

  } catch(error) {
    next(error)
  }
}