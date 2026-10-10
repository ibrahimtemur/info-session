import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import db from '../src/db.js';

describe('Info Session API', () => {
  beforeAll(() => {
    db.prepare('DELETE FROM participants').run();
  });

  afterAll(() => {
    db.prepare('DELETE FROM participants').run();
  });

  const validAnswers = {
    crowd: 4,
    starter: 3,
    interests: ['tech', 'art'],
    style: 'talker',
    goal: 'network',
    dept: 'engineering',
    friday: 'out',
    drink: 'coffee'
  };

  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  let participantId;

  it('POST /api/participants should create a participant', async () => {
    const res = await request(app).post('/api/participants').send({
      name: 'Test User',
      deviceId: 'test-device-1',
      answers: validAnswers
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test User');
    expect(res.body.status).toBe('seated');
    expect(res.body.tableNumber).toBeTypeOf('number');
    participantId = res.body.id;
  });

  it('POST /api/participants should return 409 for duplicate device', async () => {
    const res = await request(app).post('/api/participants').send({
      name: 'Test User 2',
      deviceId: 'test-device-1',
      answers: validAnswers
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('already_registered');
    expect(res.body.error.details.participantId).toBe(participantId);
  });

  it('GET /api/participants/:id should return participant', async () => {
    const res = await request(app).get(`/api/participants/${participantId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(participantId);
    expect(res.body.status).toBe('seated');
  });

  let adminToken;
  it('POST /api/admin/login should return token for valid password', async () => {
    const res = await request(app).post('/api/admin/login').send({
      password: process.env.ADMIN_PASSWORD
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  it('POST /api/admin/login should return 401 for invalid password', async () => {
    const res = await request(app).post('/api/admin/login').send({
      password: 'wrong'
    });
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/export.csv should require auth', async () => {
    const res = await request(app).get('/api/admin/export.csv');
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/export.csv should export data', async () => {
    const res = await request(app)
      .get('/api/admin/export.csv')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('Test User');
  });

  it('PATCH /api/participants/:id/table should move participant', async () => {
    const res = await request(app)
      .patch(`/api/participants/${participantId}/table`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ tableNumber: 2 });
    
    expect(res.status).toBe(200);
    expect(res.body.tableNumber).toBe(2);
  });

  it('POST /api/participants race condition capacity test (50 parallel)', async () => {
    // Clear DB to test capacity
    db.prepare('DELETE FROM participants').run();

    const reqs = [];
    for (let i = 0; i < 50; i++) {
      reqs.push(
        request(app).post('/api/participants').send({
          name: `Parallel User ${i}`,
          deviceId: `parallel-device-${i}`,
          answers: validAnswers
        })
      );
    }
    const responses = await Promise.all(reqs);
    
    let seated = 0;
    let waitlist = 0;
    for (const r of responses) {
      if (r.status === 201) seated++;
      if (r.status === 200 && r.body.status === 'waitlist') waitlist++;
    }
    
    expect(seated).toBe(50);
    expect(waitlist).toBe(0);

    // Let's add 25 more to push it over 72
    const reqs2 = [];
    for (let i = 50; i < 75; i++) {
      reqs2.push(
        request(app).post('/api/participants').send({
          name: `Parallel User ${i}`,
          deviceId: `parallel-device-${i}`,
          answers: validAnswers
        })
      );
    }
    const responses2 = await Promise.all(reqs2);
    
    let seated2 = 0;
    let waitlist2 = 0;
    for (const r of responses2) {
      if (r.status === 201) seated2++;
      if (r.status === 200 && r.body.status === 'waitlist') waitlist2++;
    }
    
    expect(seated2).toBe(22); // 72 - 50
    expect(waitlist2).toBe(3); // 75 - 72

    const tablesRes = await request(app).get('/api/tables');
    expect(tablesRes.status).toBe(200);
    for (const t of tablesRes.body.tables) {
      expect(t.count).toBeLessThanOrEqual(6);
    }
    expect(tablesRes.body.totals.seated).toBe(72);
    expect(tablesRes.body.totals.waitlisted).toBe(3);
  });
});
