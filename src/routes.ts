import { Router } from 'express'

import { index } from '@/controller'

const router = Router()

router.get('/', index)

export default router
