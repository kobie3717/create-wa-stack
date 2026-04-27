# WhatsApp Auth Directory
WA_AUTH_DIR=./wa-auth

# API Configuration
API_KEY=your-secret-api-key-here
PORT={{port}}

{{#if withWebhooks}}
# Webhook Configuration
WEBHOOK_URL=http://localhost:9000
WEBHOOK_SECRET=change-me-in-production
{{/if}}

{{#if withRest}}
# REST API Configuration
# API_KEY above is used for authentication
{{/if}}

# Logging
LOG_LEVEL=info
