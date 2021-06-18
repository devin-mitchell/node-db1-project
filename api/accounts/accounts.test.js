const request = require('supertest')
const db = require('../../data/db-config')
const server = require('../server')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async () => {
await db('accounts').truncate()
await db.seed.run()
})
afterAll(async () => {
await db.destroy()
})

test('sanity', () => {
expect(true).toBeTruthy()
})

describe('[GET] /', () => {
    it('returns a status 200 OK', async () => {
        const res = await request(server).get('/')
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({ api: 'up!' })
        expect(res.body).toMatchSnapshot() // for large JSON
    })
    it('returns a list of accounts', async () => {
        const res = await request(server).get('/api/accounts')
        expect(res.body).toHaveLength(13)
    })

})

describe('[POST] /api/accounts', () => {
    it('returns a status code 201', async () => {
        const res = await request(server).post('/api/accounts').send({ name: 'account-14', budget: 220.34 })
        expect(res.status).toBe(201)
    })
    it('returns newly created account', async () => {
        const res = await request(server).post('/api/accounts').send({ name: 'account-14', budget: 220.34 })
        expect(res.body).toMatchObject({ name: 'account-14', budget: 220.34 })
      })
})

describe('[DELETE] /api/accounts/:id', () => {
    it('returns a status code 204', async () => {
        const res = await request(server).delete('/api/accounts/13')
        expect(res.status).toBe(204)
    })
    it('deletes account by ID', async () => {
        await request(server).delete('/api/accounts/13')
        const accounts = await request(server).get('/api/accounts')
        expect(accounts.body).toHaveLength(12)
    })
})

