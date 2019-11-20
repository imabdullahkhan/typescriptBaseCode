import mongoose from "mongoose";
import tracer from "tracer";
import locals from "../config/config";
const log = tracer.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;

const connect = () => {

  mongoose.connect(locals.config().mongoUrl);
  const db = mongoose.connection;
  db.on("error", () => log("connection error:"));
  db.once("open", () => {
    // we're connected!
    log(`MongoDB connected on  ${locals.config().mongoUrl}`);
    log(`###########################################################################`);
  });
};

export default connect;
