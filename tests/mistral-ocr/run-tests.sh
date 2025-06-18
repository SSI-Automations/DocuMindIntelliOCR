#!/bin/bash

# Mistral OCR Test Runner Script

echo "🔍 Mistral OCR Test Runner (Chat Completion API)"
echo "==============================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your MISTRAL_API_KEY"
    echo "You can copy .env.local.example as a template"
    echo ""
    echo "The tests use pixtral-12b model via chat completion API"
    exit 1
fi

# Check if MISTRAL_API_KEY is set
if ! grep -q "MISTRAL_API_KEY=" .env.local; then
    echo "❌ Error: MISTRAL_API_KEY not found in .env.local!"
    echo "Please add your Mistral API key to .env.local"
    echo ""
    echo "Note: These tests use the official chat completion approach"
    echo "with pixtral-12b model for OCR functionality"
    exit 1
fi

# Parse command line arguments
TEST_FILE=""
MODE="normal"

while [[ $# -gt 0 ]]; do
    case $1 in
        --ui)
            MODE="ui"
            shift
            ;;
        --headed)
            MODE="headed"
            shift
            ;;
        --debug)
            MODE="debug"
            shift
            ;;
        *)
            TEST_FILE=$1
            shift
            ;;
    esac
done

# Run tests based on mode
case $MODE in
    ui)
        echo "🎨 Running tests in UI mode..."
        pnpm test:ui tests/mistral-ocr/$TEST_FILE
        ;;
    headed)
        echo "🖥️  Running tests in headed mode..."
        pnpm test:headed tests/mistral-ocr/$TEST_FILE
        ;;
    debug)
        echo "🐛 Running tests in debug mode..."
        PWDEBUG=1 pnpm test tests/mistral-ocr/$TEST_FILE
        ;;
    *)
        echo "🚀 Running tests..."
        pnpm test tests/mistral-ocr/$TEST_FILE
        ;;
esac