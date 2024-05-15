import cypressConfig from "../../../cypress.config.js";

describe('Login Test', () => {
    //Login regular user
    it('Login User', () => {
        cy.request({
            method: 'GET',
            url: cypressConfig.e2e.baseUrl + '/login',
            body: {
                email: 'test@dings.de',
                password: 'password'
            }}).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('cookie');
            });
    });
    //Login admin user
    it('Login Admin', () => {
        cy.request({
            method: 'GET',
            url: cypressConfig.e2e.baseUrl + '/login',
            body: {
                email: 'adminTest@dings.de',
                password: 'passwordAdmin'
            }}).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('cookie');
            });
    });
    //Login with wrong password
    it('Login with wrong password', () => {
        cy.request({
            method: 'GET',
            url: cypressConfig.e2e.baseUrl + '/login',
            body: {
                email: 'test@dings.de',
                password: 'passwordWrong'
            }}).then(response => {
            expect(response.status).to.eq(500);
            expect(response.body).to.have.property('message');
            });
    });
});