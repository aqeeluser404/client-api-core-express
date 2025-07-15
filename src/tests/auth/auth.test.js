
// ─── Dependencies ─────────────────────────────────────────────

import supertest from "supertest";
import app from '../../app.js';
const request = supertest(app);
import { connect, close } from '../../config/db.js'
import User from "../../models/userModel.js";

// ─── Environment Variables ─────────────────────────────────────────────

import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

// ─── Tests ─────────────────────────────────────────────

export function registerTest() {
    describe('POST /api/v1/auth/register', () => {
        beforeAll(async () => {
            await connect()
        })

        it('should register a new user successfully', async () => {
            const existing = await User.findOne({ email: 'aqeelhanslo@gmail.com' })
            if (existing) {
                console.log('User already exists — skipping test')
                return
            }
            const res = await request
                .post('/api/v1/auth/register')
                .send({
                    firstName: 'Test',
                    lastName: 'User',
                    // gender: 
                    email: 'aqeelhanslo@gmail.com',
                    // phone: '1234567890',
                    username: 'aqeeluser404',
                    password: 'testpass',
                })

            // userId = res.body.user?._id

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('message', 'User registered successfully')
        })

        afterAll(async () => {
            await close()
        })
    })
}

registerTest()





