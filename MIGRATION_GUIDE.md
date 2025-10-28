# MCP Configuration Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from the legacy MCP configuration format to the new enhanced version. The migration process is designed to be straightforward while ensuring all security and functionality improvements are properly implemented.

## Legacy Configuration Format

Your current configuration looks like this:

```json
{
  "servers": {
    "huggingface": {
      "url": "https://huggingface.co/mcp",
      "headers": {
        "Authorization": "Bearer <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>"
      }
    }
  }
}
```

## New Enhanced Configuration Features

The enhanced configuration includes:

- **Security**: Environment variables for sensitive data, token rotation, encryption
- **Validation**: JSON Schema validation, type checking
- **Monitoring**: Health checks, metrics, alerting
- **Performance**: Rate limiting, caching, compression
- **Scalability**: Multi-environment support, feature flags

## Migration Steps

### Step 1: Backup Current Configuration

Before starting the migration, create a backup of your current configuration:

```bash
# Create backup directory
mkdir -p backups

# Backup original configuration
cp ../../AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json backups/cline_mcp_settings_original.json

# Create timestamped backup
cp backups/cline_mcp_settings_original.json backups/cline_mcp_settings_$(date +%Y%m%d_%H%M%S).json
```

### Step 2: Set Up Environment Variables

Create a `.env` file to store your sensitive configuration:

```bash
# Create .env file (ensure it's in .gitignore)
touch .env

# Add your configuration (DO NOT commit this file)
```

**`.env` file content:**
```bash
# HuggingFace MCP Configuration
HUGGINGFACE_MCP_URL=https://huggingface.co/mcp
HUGGINGFACE_API_TOKEN=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

# Optional: Additional configuration
SMTP_SERVER=your.smtp.server.com
```

**Important Security Notes:**
- Add `.env` to your `.gitignore` file
- Never commit the `.env` file to version control
- Use different tokens for different environments
- Regularly rotate your tokens

### Step 3: Create Directory Structure

```bash
# Create necessary directories
mkdir -p schemas
mkdir -p logs
mkdir -p backups
```

### Step 4: Deploy Enhanced Configuration

1. **Copy the new configuration file:**
   ```bash
   # Replace the old configuration
   cp cline_mcp_settings_improved.json ../../AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
   ```

2. **Copy the JSON schema:**
   ```bash
   # Copy schema to the configuration directory
   cp schemas/mcp-config-schema.json ../../AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/
   ```

### Step 5: Validate Configuration

Use a JSON Schema validator to ensure your configuration is correct:

```bash
# Using Node.js (install if needed: npm install -g ajv-cli)
ajv validate -s mcp-config-schema.json -d cline_mcp_settings_improved.json

# Using Python (install if needed: pip install jsonschema)
python -c "
import json
import jsonschema
with open('mcp-config-schema.json') as f:
    schema = json.load(f)
with open('cline_mcp_settings_improved.json') as f:
    config = json.load(f)
jsonschema.validate(config, schema)
print('✅ Configuration is valid!')
"
```

### Step 6: Configure Environment-Specific Settings

Edit the configuration file to match your environment:

**For Development:**
```json
{
  "defaults": {
    "environment": "development"
  },
  "environments": {
    "development": {
      "servers": {
        "huggingface": {
          "features": {
            "logging": {
              "level": "debug"
            }
          }
        }
      }
    }
  }
}
```

**For Production:**
```json
{
  "defaults": {
    "environment": "production"
  },
  "environments": {
    "production": {
      "servers": {
        "huggingface": {
          "features": {
            "logging": {
              "level": "info"
            }
          }
        },
        "monitoring": {
          "alerts": {
            "enabled": true
          }
        }
      }
    }
  }
}
```

### Step 7: Test the Configuration

1. **Load the configuration:**
   ```bash
   # Test configuration loading (requires a MCP client that supports the new format)
   mcp-client --config cline_mcp_settings.json --test
   ```

2. **Verify server connectivity:**
   ```bash
   # Test HuggingFace MCP server connection
   curl -H "Authorization: Bearer ${HUGGINGFACE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        "${HUGGINGFACE_MCP_URL}/health"
   ```

3. **Check configuration variables:**
   ```bash
   # Verify environment variables are loaded
   echo "HUGGINGFACE_MCP_URL: $HUGGINGFACE_MCP_URL"
   echo "HUGGINGFACE_API_TOKEN: ${HUGGINGFACE_API_TOKEN:0:10}..." # Show first 10 chars only
   ```

### Step 8: Enable Monitoring (Optional)

For production environments, consider enabling monitoring features:

```json
{
  "environments": {
    "production": {
      "monitoring": {
        "healthChecks": {
          "enabled": true,
          "interval": 300000
        },
        "metrics": {
          "enabled": true
        },
        "alerts": {
          "enabled": true,
          "channels": ["email"]
        }
      }
    }
  }
}
```

### Step 9: Enable Security Features

Gradually enable security features:

1. **Start with token rotation:**
   ```json
   {
     "security": {
       "tokenRotation": {
         "enabled": true,
         "rotationInterval": "30d"
       }
     }
   }
   ```

2. **Add encryption if needed:**
   ```json
   {
     "security": {
       "encryption": {
         "enabled": true,
         "algorithm": "AES-256-GCM"
       }
     }
   }
   ```

### Step 10: Clean Up

```bash
# Remove old backup if migration was successful (keep for at least 30 days)
# rm backups/cline_mcp_settings_original.json

# Update documentation
echo "Migration completed on $(date)" > migration_log.txt
```

## Rollback Procedure

If you need to rollback to the original configuration:

```bash
# Restore original configuration
cp backups/cline_mcp_settings_original.json ../../AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json

# Clear environment variables (if set)
unset HUGGINGFACE_API_TOKEN
unset HUGGINGFACE_MCP_URL

# Test original configuration
curl -H "Authorization: Bearer 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" \
     https://huggingface.co/mcp
```

## Common Migration Issues

### Issue 1: Environment Variables Not Loaded

**Symptoms:**
- Configuration fails to load
- Authentication errors

**Solution:**
```bash
# Check if environment variables are set
echo $HUGGINGFACE_API_TOKEN
echo $HUGGINGFACE_MCP_URL

# If not set, source your .env file
source .env

# Verify they're now loaded
env | grep HUGGINGFACE
```

### Issue 2: JSON Schema Validation Fails

**Symptoms:**
- Configuration validation errors
- Configuration rejected by MCP client

**Solution:**
```bash
# Check for syntax errors
jq . cline_mcp_settings.json

# Validate against schema
ajv validate -s mcp-config-schema.json -d cline_mcp_settings.json

# Common issues:
# - Missing required fields (version, environments)
# - Invalid environment variable syntax (should be ${VAR_NAME})
# - Invalid URLs or formats
```

### Issue 3: Server Connection Failures

**Symptoms:**
- Connection timeouts
- Authentication failures
- Server unavailable errors

**Solution:**
```bash
# Test server connectivity
curl -v -H "Authorization: Bearer ${HUGGINGFACE_API_TOKEN}" \
     "${HUGGINGFACE_MCP_URL}"

# Check environment variable values
echo "URL: $HUGGINGFACE_MCP_URL"
echo "Token: ${HUGGINGFACE_API_TOKEN:0:20}..."

# Verify token is valid (truncated for security)
```

### Issue 4: Permissions Issues

**Symptoms:**
- File permission errors
- Configuration file not readable

**Solution:**
```bash
# Fix file permissions
chmod 644 ../../AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
chmod 600 .env  # Keep .env file private

# Check ownership
ls -la ../../AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/
```

## Verification Checklist

After migration, verify:

- [ ] Configuration file is valid JSON
- [ ] JSON Schema validation passes
- [ ] Environment variables are loaded correctly
- [ ] Server connectivity is working
- [ ] Authentication is successful
- [ ] Monitoring features are functional (if enabled)
- [ ] Logs are being generated (if logging enabled)
- [ ] Configuration loads without errors

## Next Steps

After successful migration:

1. **Document your changes** in your team's documentation
2. **Update monitoring dashboards** to track new metrics
3. **Train team members** on the new configuration format
4. **Set up regular reviews** of the configuration and environment variables
5. **Implement backup procedures** for the new configuration format

## Support

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Review the configuration documentation
3. Validate your configuration using the provided schema
4. Test in a development environment first
5. Keep the original configuration as backup until fully confident

## Security Reminder

- Never commit `.env` files or API tokens to version control
- Regularly rotate your API tokens
- Use different tokens for different environments
- Monitor for unauthorized access attempts
- Keep your configuration files secure and backed up

## Migration Timeline

| Phase | Duration | Tasks |
|-------|----------|--------|
| Preparation | 1-2 hours | Backup, environment setup |
| Migration | 2-3 hours | Configuration update, validation |
| Testing | 1-2 hours | Connectivity, functionality testing |
| Monitoring Setup | 2-4 hours | Health checks, metrics, alerts |
| Total | 6-11 hours | Complete migration and validation |

**Note**: This timeline is for a complete migration with full monitoring setup. Basic migration can be completed in 2-3 hours.
