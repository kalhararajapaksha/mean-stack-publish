import {describe, it} from "@jest/globals";
import request from "supertest"
import {app} from "../src/server";

describe('POST /employees', () => {
    it('should create a new employee', async () => {
        await request(app)
        const employee = { 'name': 'John Doe', 'position': 'admin','level':"junior" };        
        await request(app).post('/').send(employee)
        .set("Accept", "application/json")
        .expect(200)
  
    });

    // it('should return a 400 status code for an invalid request', async () => {
    //     const employee = { age: 'thirty', salary: 50000 };
    //     const response = await request(app).post('/employee').send(employee);

    //     expect(response.status).toBe(400);
    //     expect(response.text).toBe('Name is required');
    // });
});