const request = require('supertest');
const app = require('./main');

let createdNoteId;

describe('Notes API', () => {

  it('GET /api/notes - should return all notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/notes - should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'Test Note', content: 'This is a test note.' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    createdNoteId = res.body.id;
  });

  it('GET /api/notes/:id - should return the created note', async () => {
    const res = await request(app).get(`/api/notes/${createdNoteId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toBe(createdNoteId);
  });

  it('PUT /api/notes/:id - should update the note', async () => {
    const res = await request(app)
      .put(`/api/notes/${createdNoteId}`)
      .send({ title: 'Updated Note', content: 'Updated content.' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Note updated successfully');
  });

  it('DELETE /api/notes/:id - should delete the note', async () => {
    const res = await request(app).delete(`/api/notes/${createdNoteId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Note deleted successfully');
  });

});
