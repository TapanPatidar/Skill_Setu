import express from 'express';
import { getDomainTaxonomy } from '../controllers/metaController.js';

const router = express.Router();

router.get('/domains', getDomainTaxonomy);

export default router;
