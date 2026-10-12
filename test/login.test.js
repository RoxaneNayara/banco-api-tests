const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config()
const postLogin = require('../fixtures/postLogin.json')

describe('Login', () => {
    describe ('POST /login', () => {
        it('Deve retornar 200 com um token em string com credenciais válidas', async () => {
            const bodyLogin = {
                username: process.env.TEST_USERNAME,
                senha: process.env.TEST_PASSWORD
            };
            
            const resposta = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.token).to.be.a('string');

        })
    })
})