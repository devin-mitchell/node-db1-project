const router = require('express').Router()
const AcctModel = require('./accounts-model')
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId
} = require('./accounts-middleware')

router.get('/', (req, res, next) => {
  AcctModel.getAll()
    .then(accounts => {
      res.status(200).json(accounts)
    })
    .catch(next)
})

router.get('/:id', checkAccountId, (req, res, next) => {
  AcctModel.getById(req.params.id)
    .then(account => {
      res.status(200).json(account)
    })
    .catch(next)
})

router.post(
  '/', 
  checkAccountPayload, 
  checkAccountNameUnique, 
  (req, res, next) => {
    AcctModel.create(req.body)
      .then((newAcct) => {
        res.status(201).json({
          name: newAcct.name.trim(),
          budget: newAcct.budget
        })
      })
      .catch(next)
})

router.put(
  '/:id',   
  checkAccountId,
  checkAccountPayload, 
  checkAccountNameUnique, 
  (req, res, next) => {
    AcctModel.updateById(req.params.id, req.body)
      .then(acct => {
        res.status(200).json(acct)
      })
      .catch(next)
});

router.delete('/:id', checkAccountId, (req, res, next) => {
  AcctModel.deleteById(req.params.id)
    .then(deleted => {
      res.status(204).json(deleted)
    })
    .catch(next)
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack
  })
})

module.exports = router;
