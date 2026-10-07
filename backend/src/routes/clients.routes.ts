import { Router } from 'express'
import { 
    createClient, 
    getClients,
    searchClient,
    updateClient,
    deleteClient
 } from '../controllers/clients.controllers.js'

const router = Router();

router.post('/', createClient);

router.get('/', getClients);

router.get('/search', searchClient);

router.patch('/:id', updateClient);

router.delete('/:id', deleteClient);

export default router;