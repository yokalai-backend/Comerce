export function validateBody(schema: any) {
  return async (req: any) => {
    req.body = schema.parse(req.body);
  };
}

export function validateParams(schema: any) {
  return async (req: any) => {
    req.params = schema.parse(req.params);
  };
}
