export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
} as const;

export const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
} as const;

export const optionsResponse = {
  statusCode: 200,
  headers: corsHeaders,
  body: '',
};

export const methodNotAllowed = {
  statusCode: 405,
  headers: jsonHeaders,
  body: JSON.stringify({ error: 'Method not allowed' }),
};