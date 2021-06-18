const AcctModel = require('./accounts-model')

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body
  if (!name || !budget && isNaN(budget)) {
    next({
      status: 400,
      message: 'name and budget are required'
    })
  } else if (typeof name !== 'string') {
    next({
      status: 400,
      message: 'name of account must be a string'
    })
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    next({
      status: 400,
      message: 'name of account must be between 3 and 100'
    })
  } else if (typeof budget !== 'number') {
    next({
      status: 400,
      message: 'budget of account must be a number'
    })
  } else if (budget < 0 || budget > 1000000) {
    next({
      status: 400,
      message:'budget of account is too large or too small'
    })
  } else {
    req.newAcct = {
      name: name.trim(),
      budget: budget
    }
    next()
  }
}

exports.checkAccountNameUnique =  (req, res, next) => {
  const { name } = req.body
   AcctModel.getAll()

  .then(accounts => {
    accounts.forEach(account => {
      if (account.name === name) {
        next({
          status: 400,
          message: 'that name is taken'
        })
      } 
    });
    next()
  })
  .catch(next)
}

exports.checkAccountId = (req, res, next) => {
 AcctModel.getById(req.params.id)
  .then(account => {
    if (!account) {
      next({
        status: 404,
        message: 'account not found'
      })
    } else {
      next()
    }
  })
  .catch(next)
}
