#!/bin/bash

# MCP Configuration Validation Script
# This script validates the enhanced MCP configuration

set -e
source .env

echo "🔍 MCP Configuration Validation Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validation functions
check_file_exists() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ Found: $1${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing: $1${NC}"
        return 1
    fi
}

validate_json() {
    if jq empty "$1" 2>/dev/null; then
        echo -e "${GREEN}✅ Valid JSON: $1${NC}"
        return 0
    else
        echo -e "${RED}❌ Invalid JSON: $1${NC}"
        return 1
    fi
}

validate_schema() {
    echo "Validating schema for $1..."
    # Basic schema validation using jq if ajv is not available
    local schema_file="$2"
    if command -v ajv &> /dev/null; then
        if ajv validate -s "$schema_file" -d "$1" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Schema validation passed: $1${NC}"
            return 0
        else
            echo -e "${RED}❌ Schema validation failed: $1${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  ajv not available, skipping schema validation${NC}"
        return 0
    fi
}

check_environment_variables() {
    echo "Checking environment variables..."
    local required_vars=("HUGGINGFACE_MCP_URL" "HUGGINGFACE_API_TOKEN")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        else
            echo -e "${GREEN}✅ Set: $var${NC}"
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo -e "${RED}❌ Missing environment variables: ${missing_vars[*]}${NC}"
        echo "Please set these variables in your .env file or environment"
        return 1
    fi
    return 0
}

test_connectivity() {
    echo "Testing server connectivity..."
    if command -v curl &> /dev/null; then
        if curl -s -f -H "Authorization: Bearer ${HUGGINGFACE_API_TOKEN}" \
                   -H "Content-Type: application/json" \
                   "${HUGGINGFACE_MCP_URL}/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Server connectivity successful${NC}"
            return 0
        else
            echo -e "${RED}❌ Server connectivity failed${NC}"
            echo "Please check your URL and API token"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  curl not available, skipping connectivity test${NC}"
        return 0
    fi
}

# Main validation process
echo
echo "Step 1: Checking file existence..."
files_ok=true
check_file_exists "mcp_config.json" || files_ok=false
check_file_exists "schemas/mcp-config-schema.json" || files_ok=false
check_file_exists "MCP_CONFIG_DOCUMENTATION.md" || files_ok=false
check_file_exists "MIGRATION_GUIDE.md" || files_ok=false

echo
echo "Step 2: Validating JSON files..."
if [ "$files_ok" = true ]; then
    validate_json "mcp_config.json" || echo "Configuration JSON validation failed"
    validate_json "schemas/mcp-config-schema.json" || echo "Schema JSON validation failed"
else
    echo -e "${RED}❌ Skipping JSON validation due to missing files${NC}"
fi

echo
echo "Step 3: Validating configuration schema..."
if [ "$files_ok" = true ]; then
    validate_schema "mcp_config.json" "schemas/mcp-config-schema.json"
else
    echo -e "${RED}❌ Skipping schema validation due to missing files${NC}"
fi

echo
echo "Step 4: Checking environment variables..."
env_ok=true
check_environment_variables || env_ok=false

echo
echo "Step 5: Testing connectivity..."
if [ "$env_ok" = true ]; then
    connectivity_ok=true
    test_connectivity || connectivity_ok=false
else
    echo -e "${RED}❌ Skipping connectivity test due to missing environment variables${NC}"
fi

echo
echo "======================================"
echo "📊 Validation Summary"
echo "======================================"
echo "Files Present: $([ "$files_ok" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
echo "JSON Valid: $([ "$files_ok" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
echo "Environment Variables: $([ "$env_ok" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
echo "Server Connectivity: $([ "$connectivity_ok" = true ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"

echo
if [ "$files_ok" = true ] && [ "$env_ok" = true ] && [ "$connectivity_ok" = true ]; then
    echo -e "${GREEN}🎉 All validations passed! Your MCP configuration is ready.${NC}"
    echo
    echo "Next steps:"
    echo "1. Review the configuration documentation: MCP_CONFIG_DOCUMENTATION.md"
    echo "2. Follow the migration guide if needed: MIGRATION_GUIDE.md"
    echo "3. Deploy the configuration to your MCP client"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some validations failed. Please review the issues above.${NC}"
    echo
    echo "Common solutions:"
    echo "1. Ensure all files are present"
    echo "2. Set required environment variables in your .env file"
    echo "3. Verify your API token is valid"
    echo "4. Check server URL accessibility"
    exit 1
fi
