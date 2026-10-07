import { prisma } from '../lib/prisma.js';
import { 
  getPagination, 
  type PaginationQuery,
  paginationMeta 
} from '../utils/pagination.js'
import { type ClientFilter } from '../validation/clients.validation.js';

type CreateClientData = {
  firstName: string;
  lastName: string;
  email?: string | undefined;
  phone?: string | undefined;
  jobTitle?: string | undefined;
  linkedin?: string | undefined;
  companyId?: number | undefined;
  createdBy: number;
};

type UpdateClientData = {
  id: number;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  jobTitle?: string | undefined;
  linkedin?: string | undefined;
  companyId?: number | undefined;
}

//create a client
export async function createClientService(data: CreateClientData) {

  const client = await prisma.client.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle }),
      ...(data.linkedin !== undefined && { linkedin: data.linkedin }),
      ...(data.companyId !== undefined && { companyId: data.companyId }),
      createdBy: data.createdBy,
    },
  });

  return client;
}

//search for a client
export async function searchClientService(filter: ClientFilter, value: string | number) {
    const client = await prisma.client.findFirst({
      where: {
        [filter]: value,
        deletedAt: null
      }
    });

    return client
}

export async function getClientsService(query: PaginationQuery) {
  const {page, limit} = query;
  const {skip, take} = getPagination(page, limit);

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        id: 'asc'
      },
      skip,
      take
    }),

    prisma.client.count({
      where: {
        deletedAt: null
      }
    })
  ]);

  const meta = paginationMeta(page, limit, total);

  return {
    data: clients,
    meta
  };
}

export async function updateClientService(data: UpdateClientData) {
  // const { id, ...updateFields } = data;
    //     const cleanData = Object.fromEntries(
  //   Object.entries(updateFields).filter(([_, value]) => value !== undefined)
  // );
  
  const client = prisma.client.update({
    where: {
      id: data.id,
      deletedAt: null
    },
    data: {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle }),
      ...(data.linkedin !== undefined && { linkedin: data.linkedin }),
      ...(data.companyId !== undefined && { companyId: data.companyId }),
    }
  })

  return client
}

export async function deleteClientService(id: number) {
  const client = await prisma.client.update({
    where: {
      id,
      deletedAt: null
    },
    data: {
      deletedAt: new Date()
    }
  });

  return client;
}