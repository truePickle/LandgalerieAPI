import cypressConfig from "../../../cypress.config.js";

describe('Painting Test', () => {
    let testAuthor;

    it("Create User", () => {
        cy.request({
            method: 'PUT',
            url: cypressConfig.e2e.baseUrl + '/create/user',
            body: {
                firstname: 'Test',
                lastname: 'User',
                email: 'testUser@dings.de',
                password: 'password',
                isAdmin: false,
                isArtist: true
            }}).then(response => {
            expect(response.status).to.eq(200);
            testAuthor = response.id;
        });
    });
    it('Create Painting', () => {
        cy.request({
            method: 'PUT',
            url: cypressConfig.e2e.baseUrl + '/create/painting',
            body: {
                description: 'This is a test painting',
                image: 'image',
                author: testAuthor
            }
        }).then(response => {
            expect(response.status).to.eq(200);
        });
    });
});