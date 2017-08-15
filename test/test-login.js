var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should(); 
chai.use(chaiHttp);

//Test Login page routes
describe('Login', function() {
    it('Should render the login page on GET', function(done) {
    chai.request(server)
        .get('/')
        .end(function(err, res){
            res.should.have.status(200);
            done();     //End test case
        });
    });

    it('Should redirect to login page for failed login attempt due to nonexistant user', function(done) {
        var agent = chai.request.agent(server);
        agent.post('/signIn')
        .send({loginEmail: 'gregg@example.com', loginPassword: 'bye'})
        .end(function(err, res){
            res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
            done();     //End test case
        });
    });

    it('Should redirect to Marlyns newfeed page on successful registration attempt', function(done) {
        var agent = chai.request.agent(server);
        agent.post('/reg')
        .send({firstName: 'Marlyn', lastName: 'Cuenca', email: 'marlyn@uci.edu', password: 'hello', gender: 'female'})
        .end(function(err, res){
            res.should.redirectTo(res.request.protocol + '//' + res.request.host + res.req.path);
            done();     //End test case
        });
    });

    it('Should redirect to Marlyns newsfeed page on successful POST signin', function(done) {
        var agent = chai.request.agent(server);
        agent.post('/signIn')
        .send({loginEmail: 'marlyn@uci.edu', loginPassword: 'hello'})
        .end(function(err, res){
            res.should.redirectTo(res.redirects[0]);
            done();     //End test case
        });
    });

    it('Should redirect to login page for failed login attempt due to bad password', function(done) {
        var agent = chai.request.agent(server);
        agent.post('/signIn')
        .send({loginEmail: 'marlyn@uci.edu', loginPassword: 'bye'})
        .end(function(err, res){
            res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
            done();     //End test case
        });
    });

    //Clear data after tests
    /*
    after(function(done) {  
        console.log('TRUNCATE DB');
    });
    */
});

//Test Newsfeed page routes
describe('Newsfeed', function() {
    it('Should render the newsfeed page on GET', function(done) {
    chai.request(server)
        .get('/newsfeed/1')
        .end(function(err, res){
            res.should.have.status(200);
            done();     //End test case
        });
    });


});

//Test Profile page routes
describe('Profile Page', function() {
    it('Should render the profile page on GET', function(done) {
    chai.request(server)
        .get('/profile-page')
        .end(function(err, res){
            res.should.have.status(200);
            done();     //End test case
        });
    });
});
