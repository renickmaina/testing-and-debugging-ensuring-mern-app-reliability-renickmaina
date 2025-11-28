const request = require('supertest');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');
const { connectTestDB, closeTestDB, clearTestDB } = require('../helpers/testDb');

// Setup test database
beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe('Bugs API Integration Tests', () => {
  describe('GET /api/bugs', () => {
    it('should return empty array when no bugs exist', async () => {
      const res = await request(app).get('/api/bugs');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('should return all bugs', async () => {
      // Create test bugs
      await Bug.create({
        title: 'Test Bug 1',
        description: 'Description for test bug 1',
        priority: 'high',
        status: 'open'
      });

      await Bug.create({
        title: 'Test Bug 2',
        description: 'Description for test bug 2',
        priority: 'medium',
        status: 'in-progress'
      });

      const res = await request(app).get('/api/bugs');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      
      // Check that both bugs are returned
      const titles = res.body.map(bug => bug.title);
      expect(titles).toContain('Test Bug 1');
      expect(titles).toContain('Test Bug 2');
    });
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug with valid data', async () => {
      const newBug = {
        title: 'New Test Bug',
        description: 'This is a detailed description of the new test bug',
        priority: 'medium',
        status: 'open'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(newBug);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(newBug.title);
      expect(res.body.description).toBe(newBug.description);
      expect(res.body.priority).toBe(newBug.priority);
      expect(res.body.status).toBe(newBug.status);
    });

    it('should return 400 when title is missing', async () => {
      const invalidBug = {
        description: 'This bug has no title',
        priority: 'medium'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidBug);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when description is missing', async () => {
      const invalidBug = {
        title: 'Bug with no description',
        priority: 'medium'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidBug);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when title is too short', async () => {
      const invalidBug = {
        title: 'ab',
        description: 'Valid description here',
        priority: 'medium'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidBug);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/bugs/:id', () => {
    it('should return a bug by ID', async () => {
      const bug = await Bug.create({
        title: 'Specific Bug',
        description: 'Description for specific bug',
        priority: 'low',
        status: 'open'
      });

      const res = await request(app).get(`/api/bugs/${bug._id}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(bug._id.toString());
      expect(res.body.title).toBe('Specific Bug');
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Valid ObjectId but doesn't exist
      const res = await request(app).get(`/api/bugs/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    it('should update an existing bug', async () => {
      const bug = await Bug.create({
        title: 'Original Bug',
        description: 'Original description',
        priority: 'medium',
        status: 'open'
      });

      const updates = {
        title: 'Updated Bug Title',
        status: 'in-progress'
      };

      const res = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(updates.title);
      expect(res.body.status).toBe(updates.status);
      expect(res.body.description).toBe('Original description'); // Should remain unchanged
    });

    it('should return 404 when updating non-existent bug', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const updates = {
        title: 'Updated Title'
      };

      const res = await request(app)
        .put(`/api/bugs/${nonExistentId}`)
        .send(updates);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    it('should delete an existing bug', async () => {
      const bug = await Bug.create({
        title: 'Bug to delete',
        description: 'This bug will be deleted',
        priority: 'high',
        status: 'open'
      });

      const res = await request(app).delete(`/api/bugs/${bug._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Bug deleted successfully');

      // Verify bug is actually deleted
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 when deleting non-existent bug', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const res = await request(app).delete(`/api/bugs/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});