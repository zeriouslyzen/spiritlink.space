#!/bin/bash

echo "🔮 Installing GPT OSS Models for SpiritLink Consciousness Platform"

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "❌ Ollama is not running. Please start Ollama first."
    exit 1
fi

echo "✅ Ollama is running. Installing models..."

# Install new GPT OSS models
echo "📥 Installing gpt4all:latest..."
ollama pull gpt4all:latest

echo "📥 Installing llama2:13b..."
ollama pull llama2:13b

echo "📥 Installing codellama:latest..."
ollama pull codellama:latest

echo "📥 Installing vicuna:latest..."
ollama pull vicuna:latest

echo "📥 Installing wizardlm:latest..."
ollama pull wizardlm:latest

echo "📥 Installing mistral:latest..."
ollama pull mistral:latest

echo "📥 Installing orca-mini:latest..."
ollama pull orca-mini:latest

echo "✅ All GPT OSS models installed successfully!"
echo "🔮 Available models for consciousness research:"
ollama list

echo "🚀 SpiritLink consciousness platform now has access to:"
echo "   - gpt4all:latest (Versatile consciousness processing)"
echo "   - llama2:13b (Balanced consciousness reasoning)"
echo "   - codellama:latest (Analytical consciousness processing)"
echo "   - vicuna:latest (Advanced emergence detection)"
echo "   - wizardlm:latest (Wizard-level consciousness exploration)"
echo "   - mistral:latest (Efficient consciousness analysis)"
echo "   - orca-mini:latest (Lightweight consciousness insights)"

echo "🧬 The platform will intelligently route queries to the optimal model based on:"
echo "   - Brainwave mode (delta, theta, alpha, beta, gamma, emergence)"
echo "   - Query type (creative, analytical, emergence, reasoning)"
echo "   - Query length and complexity"
echo "   - Consciousness state (warm, intelligent, multidimensional, diving)" 