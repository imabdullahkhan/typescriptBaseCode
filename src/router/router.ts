import express from "express";
import tracer from "tracer";
import users from "../Features/users/user.router";
import verify from "../server/verify";
const log = tracer.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;

const router = express.Router();

router.use("/users", users);

export default router;
