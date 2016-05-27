var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
require('sinon-mongoose');

var authService = require('../services/auth');
var Auth = require('../models/auth');
var UserMock = sinon.mock(Auth.User);

describe("Testing auth service", function () {
    describe("Testing validate token service", function () {
        it("Should validate token", function (done) {
            var req = {
                headers: {
                    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjU3M2NiYzFkNTBiYTJkYTIwOGQzYmNmMCIsImVtYWlsIjoiZGVtbzdAZGVtby5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCQzT1plLmJoYWc0MXYuMXZENnV3VU9lZlVrZXFPc2FyL21QYkQzM2tOUno2dEN4S2MzWjJySyIsIl9fdiI6MH0sImlhdCI6MTQ2NDM4NzAyNn0.cg4WOacUbFsN47khoEAfs2AGQJCQCAUfQIFlqkW5XiE'
                }
            };

            authService.verify(req, null, function (res) {
                done();
            });
        });

        it("Should not validate token", function (done) {
            var req = {
                headers: {
                    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjU3M2NiYzFkNTBiYTJkYTIwOGQzYmNmMCIsImVtYWlsIjoiZGVtbzdAZGVtby5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCQzT1plLmJoYWc0MXYuMXZENnV3VU9lZlVrZXFPc2FyL21QYkQzM2tOUno2dEN4S2MzWjJySyIsIl9fdiI6MH0sImlhdCI6MTQ2NDAxODQwNCwiZXhwIjoxNDY0MDIyMDA0fQ.2as9h9bZXRBnizqwP1xrEp0JZFXDJK9Kl_JbmwNCl-8'
                }
            };
            var res = {
                status: function () {
                    return this;
                },
                send: function (msg) {
                    expect(msg.success).to.equal(false);
                    expect(msg.message).to.equal('invalid_token');
                    done();
                }
            };
            authService.verify(req, res, function () {
                console.log(res);
                done();
            });
        });

        it("Should fail validate token (no token provided)", function (done) {
            var req = {
                headers: {}
            };

            var res = {
                status: function () {
                    return this;
                },
                send: function (msg) {
                    expect(msg.success).to.equal(false);
                    expect(msg.message).to.equal('token_required');
                    done();
                }
            };

            authService.verify(req, res, function () {
                done();
            });
        });

    });

    describe("Testing login service", function () {
        it("Should login", function () {
            var credentials = {
                email: 'username',
                password: 'test'
            };

            UserMock
                .expects('findOne')
                .yields(null, {password: '$2a$10$F5Fb/tTpHl3Ye786.TUPXO1gDw73E2vcaPBJCYGL8fOFnO7f4r.9u'});

            authService.login(credentials, function (res) {
                expect(res.success).to.equal(true);
                expect(res.token).to.exist;
            });
        });

        it("Should not login", function () {
            var credentials = {
                email: 'username',
                password: 'test0'
            };

            UserMock
                .expects('findOne')
                .yields(null, {password: '$2a$10$F5Fb/tTpHl3Ye786.TUPXO1gDw73E2vcaPBJCYGL8fOFnO7f4r.9u'});

            authService.login(credentials, function (res) {
                expect(res.success).to.equal(false);
                expect(res.msg).to.equal('user_not_found');
            });
        });

        it("Should not find a user", function () {
            var credentials = {
                email: 'username',
                password: 'test0'
            };

            UserMock
                .expects('findOne')
                .yields(null, null);

            authService.login(credentials, function (res) {
                expect(res.success).to.equal(false);
                expect(res.msg).to.equal('user_not_found');
            });
        });
    });

    describe("Testing signup service", function () {
        it("Should signup", function (done) {
            var credentials = {
                email: 'username',
                password: 'test'
            };

            var user = new Auth.User();
            user.__proto__.save = function (cb) {
                cb(null, credentials);
            };

            sinon.mock(user)
                .expects('save')
                .yields(null, credentials);

            authService.signup(credentials, function (res) {
                expect(res.success).to.equal(true);
                expect(res.user).to.have.property('email');
                done();
            });
        });

        it("Should fail signup", function (done) {
            var credentials = {
                email: 'username',
                password: 'test'
            };

            var user = new Auth.User();
            user.__proto__.save = function (cb) {
                cb({error: true});
            };

            sinon.mock(user)
                .expects('save')
                .yields(null, credentials);

            authService.signup(credentials, function (res) {
                expect(res.error).to.equal(true);
                done();
            });
        });
    });
});