var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should(); 
chai.use(chaiHttp);
var agent = chai.request.agent(server);     //Needed for client-sessions
var path;

//Test Login page routes
describe('Login Page', function() {
    it('Should render the login page on GET', function(done) {
    chai.request(server)
        .get('/')
        .end(function(err, res){
            res.should.have.status(200);
            done();     //End test case
        });
    });

    it('Should redirect to login page for failed login attempt due to nonexistant user', function(done) {
        agent.post('/signIn')
        .send({loginEmail: 'gregg@example.com', loginPassword: 'bye'})
        .end(function(err, res){
            res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
            done();     //End test case
        });
    });

    it('Should redirect to Marlyns newfeed page on successful registration attempt', function(done) {
        agent.post('/reg')
        .send({firstName: 'Marlyn', lastName: 'Cuenca', email: 'marlyn@uci.edu', password: 'hello', gender: 'female'})
        .end(function(err, res){
            res.should.redirectTo(res.request.protocol + '//' + res.request.host + res.req.path);
            done();     //End test case
        });
    });

    it('Should redirect to Marlyns newsfeed page on successful POST signin', function(done) {
        agent.post('/signIn')
        .send({loginEmail: 'marlyn@uci.edu', loginPassword: 'hello'})
        .end(function(err, res){
            path = res.req.path;
            res.should.redirectTo(res.redirects[0]);
            done();     //End test case
        });
    });

    it('Should redirect to login page for failed login attempt due to bad password', function(done) {
        agent.post('/signIn')
        .send({loginEmail: 'marlyn@uci.edu', loginPassword: 'bye'})
        .end(function(err, res){
            res.should.redirectTo(res.request.protocol + '//' + res.request.host + '/');
            done();     //End test case
        });
    });
});

//Test Newsfeed page routes
describe('Newsfeed Page', function() {
    it('Should render the newsfeed page on GET', function(done) {
        agent.get(path)
        .end(function(err, res){
            res.should.have.status(200);
            done();     //End test case
        });
    });
    var postid;
    it('Should POST a new post and store it in database', function(done) {
        agent.post(path)
        .send({author: 'Marlyn Cuenca', content: 'Hey There!!'})
        .end(function(err, res){
            postid = res.body.id;   //Store postid for PATCH next
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('author').eql('Marlyn Cuenca');
            res.body.should.have.property('authorid');
            res.body.should.have.property('profilepic');
            res.body.should.have.property('content').eql('Hey There!!');
            res.body.should.have.property('timestamp');
            res.body.should.have.property('liked').eql(false);
            res.should.have.status(200);
            done();     //End test case
        });
    });

    it('Should PATCH the post just made', function(done) {
        agent.patch('/newsfeed/'+postid+'/editpost')
        .send({edit: 'Goodbye'})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('command').eql('UPDATE');
            res.body.should.have.property('rowCount').eql(1);
            done();     //End test case
        });
    });

    it('Should PATCH the post just made and LIKE it', function(done) {
        agent.patch('/newsfeed/'+postid+'/editlike')
        .send({like: true})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('command').eql('UPDATE');
            res.body.should.have.property('rowCount').eql(1);
            done();     //End test case
        });
    });

    it('Should POST a new comment on the post just made', function(done) {
        agent.post(path+'/comment')
        .send({author: 'Marlyn Cuenca', newComment: 'My comment'})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('commentid');
            res.body.should.have.property('postid');
            res.body.should.have.property('author').eql('Marlyn Cuenca');
            res.body.should.have.property('profilepic');
            res.body.should.have.property('comment').eql('My comment');
            done();     //End test case
        });
    });

    it('Should GET all the posts stored in database', function(done) {
        agent.get(path+'/posts')
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.greaterThan(0);
            res.body[0].should.have.property('author').eql('Marlyn Cuenca');
            res.body[0].should.have.property('content').eql('Goodbye');
            done();     //End test case
        });
    });

    it('Should GET all the comments for a specific post', function(done) {
        agent.get(path+'/allcomments')
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.greaterThan(0);
            res.body[0].should.have.property('commentid');
            res.body[0].should.have.property('postid');
            res.body[0].should.have.property('author').eql('Marlyn Cuenca');
            res.body[0].should.have.property('profilepic');
            res.body[0].should.have.property('comment').eql('My comment');
            done();     //End test case
        });
    });

    it('Should DELETE a specific post', function(done) {
        agent.delete(path+'/deletePost/'+postid)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('command').eql('DELETE');
            done();     //End test case
        });
    });
});

//Test Profile page routes
describe('Profile Page', function() {
    it('Should render the profile page on GET', function(done) {
        agent.get('/profile-page')
        .end(function(err, res){
            res.should.have.status(200);
            done();     //End test case
        });
    });
});




//Clear database after tests
/*
after(function(done) {  
    console.log('TRUNCATE DB');
});
*/