local typedefs = require "kong.db.schema.typedefs"

return {
  name = "jwt-sub-to-header",
  fields = {
    { config = {
        type = "record",
        fields = {
    }, }, },
  },
}