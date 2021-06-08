const db = require('../../data/db-config')

const getAll = () => {
  return db.select().from('accounts')
}

const getById = id => {
  return db('accounts')
    .where({ id })
    .first()
}

async function create ({ name, budget }) {
  const [id] = await db('accounts')
    .insert({ name, budget })
  
    return getById(id)
}

const updateById =  (id, { name, budget }) => {
   return db('accounts')
    .where('id', id)
    .update({ name, budget })
    .then(() => {
      return getById(id)
    })

}

async function deleteById(id) {
  const deletedAcct = await getById(id);
   await db('accounts')
    .where({ id })
    .del()

  return deletedAcct
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
