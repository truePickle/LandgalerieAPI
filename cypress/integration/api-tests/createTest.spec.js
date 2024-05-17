describe('Create Test', () => {
    let testAuthor;

    it("Create User", () => {
        cy.request({
            method: 'PUT',
            url: 'http://localhost:3000/create/user',
            body: {
                firstname: 'Test',
                lastname: 'User',
                email: 'noah.dings@email.de',
                password: 'password'
            }
        }).then(response => {
            expect(response.status).to.eq(200);
            testAuthor = response.id;
            cy.log(response.message);
            cy.log(testAuthor);
        })});
    it('Create Painting', () => {
        cy.log("creating painting for author:")
        cy.log(testAuthor);
        cy.request({
            method: 'PUT',
            url: 'http://localhost:3000/create/painting',
            body: {
                description: 'This is a test painting',
                author: testAuthor
            }
        }).then(response => {
            expect(response.status).to.eq(200);
        })});

    });