const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./index'); // Replace with the path to your Express app file

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Routes', () => {
  // Test the POST /signup route
  describe('POST /signup', () => {
    it('should create a new user', (done) => {
      chai.request(app)
        .post('/user/signup')
        .send({
          email: 'test@example.com',
          password: 'password',
          name: 'Test User',
          surname: 'Test Surname',
        })
        .end((err, res) => {
            console.log(res);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('email', 'test@example.com');
          done();
        });
    }).timeout(5000);
  });

  // Test the POST /validate-email route
  describe('POST /validate-email', () => {
    it('should send a verification email', (done) => {
      chai.request(app)
        .post('/user/validate-email')
        .send({
          email: 'test@example.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('Sent a verification email');
          done();
        });
    });
  });

  // Test the POST /login route
  describe('POST /login', () => {
    it('should verify a user and get a token', (done) => {
      chai.request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('email', 'test@example.com');
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  // Test the GET /current-user route
  describe('GET /current-user', () => {
    it('should return the current user', (done) => {
      chai.request(app)
        .get('/user/current-user')
        .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('email', 'test@example.com');
          done();
        });
    });
  });

  // Test the POST /reset-password route
  describe('POST /reset-password', () => {
    it('should send a reset password email', (done) => {
      chai.request(app)
        .post('/user/reset-password')
        .send({
          email: 'test@example.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('Sent a reset password email');
          done();
        });
    });
  });

  // Test the POST /new-password route
  describe('POST /new-password', () => {
    it('should update the user password', (done) => {
      // Replace "resetToken" and "newPassword" with actual values
      const resetToken = 'reset-token';
      const newPassword = 'new-password';

      chai.request(app)
        .post('/user/new-password')
        .send({
          id: resetToken,
          password: newPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('Password Changed Successfully');
          done();
        });
    });
  });

  // Test the GET /logout route
  describe('GET /logout', () => {
    it('should clear the access token cookie', (done) => {
      chai.request(app)
        .get('/user/logout')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.headers['set-cookie'][0]).to.include('access-token=; Path=/; Expires=');
          done();
        });
    });
  });


describe('Todo Routes', () => {

  
    // Test the POST /create-event route
    describe('POST /create-event', () => {
      it('should create a new event', (done) => {
        chai.request(app)
          .post('/todos/create-event')
          .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
          .send({
            name: 'Test Event',
            description: 'Test event description',
            short_description: 'Short description',
            location: 'Test location',
            start_date: '2023-05-18',
            end_date: '2023-05-20',
            price: 10,
            category: 'Test category',
            bannerURL: 'https://example.com/banner.jpg',
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name', 'Test Event');

            done();
          });
      });
    });
  
    // Test the POST /created-events route
    describe('POST /created-events', () => {
      it('should return the created events for a user', (done) => {
        chai.request(app)
          .post('/todos/created-events')
          .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
          .send({
            email: 'test@example.com',
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
      });
    });
  
    // Test the POST /buy route
    describe('POST /buy', () => {
      it('should buy a ticket for an event', (done) => {
        chai.request(app)
          .post('/todos/buy')
          .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
          .send({
            eventId: 'event-id',
            userId: 'user-id',
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg', 'Payment Sucessfull');
            done();
          });
      });
    });
  
    // Test the POST /mytickets route
    describe('POST /mytickets', () => {
      it('should return the tickets for a user', (done) => {
        chai.request(app)
          .post('/todos/mytickets')
          .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
          .send({
            email: 'test@example.com',
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            // Add more assertions as needed
            done();
          });
      });
    });
  
    // Test the POST /checkin route
    describe('POST /checkin', () => {
      it('should check-in a participant for an event', (done) => {
        chai.request(app)
          .post('/todos/checkin')
          .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
          .send({
            eventId: 'event-id',
            userId: 'user-id',
            participantId: 'participant-id',
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').that.includes("Check-in successfull");
            done();
          });
      });
    });
  
  });
  


describe('Event Routes', () => {
  // Test the GET / route
  describe('GET /', () => {
    it('should return all events', (done) => {
      chai.request(app)
        .get('/events/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('Events retrieved successfully');
          done();
        });
    });
  });

  // Test the GET /:eventId route
  describe('GET /:eventId', () => {
    it('should return an event by ID', (done) => {
      const eventId = 'event-id'; // Replace with an actual event ID

      chai.request(app)
        .get(`/events/${eventId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('Event retrieved successfully');
          done();
        });
    });
  });

  // Test the POST /:eventId/create-activity route
  describe('POST /:eventId/create-activity', () => {
    it('should create a new activity for an event', (done) => {
      const eventId = 'event-id'; // Replace with an actual event ID

      chai.request(app)
        .post(`/events/${eventId}/create-activity`)
        .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
        .send({
          name: 'Test Activity',
          description: 'Test activity description',
          time: '2023-05-18T12:00:00Z',
          location: 'Test location',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('Activity created successfully');
          done();
        });
    });
  });

  // Test the POST /:eventId/activities route
  describe('POST /:eventId/activities', () => {
    it('should return the activities for an event', (done) => {
      const eventId = 'event-id'; // Replace with an actual event ID

      chai.request(app)
        .post(`/events/${eventId}/activities`)
        .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('activities').that.is.an('array');
          // Add more assertions as needed
          done();
        });
    });
  });

});


describe('Event Activity Routes', () => {
  // Test the POST /register/:eventId/:activityId route
  describe('POST /register/:eventId/:activityId', () => {
    it('should register a user for an activity', (done) => {
      const eventId = 'event-id'; // Replace with an actual event ID
      const activityId = 'activity-id'; // Replace with an actual activity ID

      chai.request(app)
        .post(`/eventactivity/register/${eventId}/${activityId}`)
        .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
        .send({ userId: 'user-id' }) // Replace with an actual user ID
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('User registered successfully');
          done();
        });
    });
  });

  // Test the POST /unregister/:eventId/:activityId route
  describe('POST /unregister/:eventId/:activityId', () => {
    it('should unregister a user from an activity', (done) => {
      const eventId = 'event-id'; // Replace with an actual event ID
      const activityId = 'activity-id'; // Replace with an actual activity ID

      chai.request(app)
        .post(`/eventactivity/unregister/${eventId}/${activityId}`)
        .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('User unregistered successfully');
          done();
        });
    });
  });

  // Test the POST /checkin/:eventId/:activityId route
  describe('POST /checkin/:eventId/:activityId', () => {
    it('should check-in a user for an activity', (done) => {
      const eventId = 'event-id'; // Replace with an actual event ID
      const activityId = 'activity-id'; // Replace with an actual activity ID

      chai.request(app)
        .post(`/eventactivity/checkin/${eventId}/${activityId}`)
        .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
        .send({ participantId: 'participant-id' }) // Replace with an actual participant ID
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.includes('User checked-in successfully');
          done();
        });
    });
  });

  // Test the POST /:eventId/registered-activities route
  describe('POST /:eventId/registered-activities', () => {
    it('should return the registered activities for a user in an event', (done) => {
      const eventId = 'event-id'; // Replace with an actual event ID
      const userId = 'user-id'; // Replace with an actual user ID

      chai.request(app)
        .post(`/eventactivity/${eventId}/registered-activities?userId=${userId}`)
        .set('Cookie', 'access-token=your-token') // Replace "your-token" with an actual token
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('activities').that.is.an('array');
          done();
        });
    });
  });

});


});
