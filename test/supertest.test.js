import chai from "chai";
import supertest from "supertest";

export const expect = chai.expect;
export const requeter = supertest('http://localhost:8080')