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

export async function createClient( req: Request, res: Response, next: NextFunction) {
  try {

    const body = createClientSchema.parse(req.body);

    const client = await createClientService(body);

    res.status(201).json(client);
  } catch(error) {
    next(error)
  }
}

export async function getClients(req: Request, res: Response, next: NextFunction) {
  try {

    const query = paginationSchema.parse(req.query);

    const clients = await getClientsService(query);

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

    const {filter, value} = searchClientSchema.parse(req.query)

    let searchValue: string | number = value;

    if (filter === 'id') {
      searchValue = z.coerce.number().int().min(1).parse(value);
    }

    const client = await searchClientService(
      filter,
      searchValue
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

    const client = await updateClientService({ id, ...body });

    res.status(200).json(client);

  } catch(error) {
    next(error)
  }
}

export async function deleteClient(req: Request, res: Response, next: NextFunction) {
  try {

  const id = clientIdSchema.parse(req.params.id);

  const client = await deleteClientService(id);

  res.status(200).json(client);

  } catch(error) {
    next(error)
  }
}