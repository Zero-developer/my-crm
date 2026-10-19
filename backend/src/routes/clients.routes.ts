import { Router } from 'express'
import { 
    createClient, 
    getClients,
    searchClient,
    updateClient,
    deleteClient
 } from '../controllers/clients.controllers.js'
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', createClient);

router.get('/', getClients);

router.get('/search', searchClient);

router.patch('/:id', updateClient);

router.delete('/:id', deleteClient);

export default router;