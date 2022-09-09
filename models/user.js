const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  address: String,
  description: String,
  createdAt: Date,
});

//transform the object(id) from mongodb to id, so that it can be used to compare id
//remove the versioning from mongodb when displaying on the backend
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
