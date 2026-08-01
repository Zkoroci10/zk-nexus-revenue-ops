/**
 * ZK Revenue Ops — Gemini Spark AI Integration Module
 * ID: SYS-007
 * Module: 05_Systems/Automation/gemini_spark_integration.js
 * 
 * Connects ZK Revenue Ops WhatsApp Dispatcher & DSR Qualification Engine 
 * to Google Gemini Spark (Ultra Low-Latency Gemini 2.0 / Spark API) for real-time buyer lead triage.
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const GEMINI_SPARK_MODEL = "gemini-2.0-flash-exp"; // Gemini Spark / Flash ultra-fast model endpoint

/**
 * Analyzes incoming WhatsApp lead text using Gemini Spark AI
 * Extracts: Buyer Name, Preferred Location, Max Budget, Net Monthly Income, Commitments, & Intent Grade
 */.async function analyzeLeadWithGeminiSpark(rawMessageText) {
    if (!GEMINI_API_KEY) {
        console.log("ℹ️ GEMINI_API_KEY not set in environment. Running in Native Rule Engine mode.");
        return fallbackLeadExtraction(rawMessageText);
    }

    const systemPrompt = `You are ZK Revenue Ops AI SDR for Malaysian Real Estate. Analyze the following buyer WhatsApp message and extract JSON data:
    {
      "name": "extracted name or Unknown",
      "preferred_location": "location area in Malaysia",
      "max_budget": number (RM value),
      "net_income": number (RM monthly),
      "commitments": number (RM monthly),
      "property_type": "Condo/Terrace/Semi-D/etc",
      "buying_intent": "High/Medium/Low",
      "summary": "1 sentence Malaysian Malay summary"
    }`;

    const payload = JSON.stringify({
        contents: [
            {
                role: "user",
                parts: [
                    { text: `${systemPrompt}\n\nBuyer Message:\n"${rawMessageText}"` }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
            responseMimeType: "application/json"
        }
    });

    return new Promise((resolve) => {
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${GEMINI_SPARK_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const text = parsed.candidates[0].content.parts[0].text;
                    const jsonResult = JSON.parse(text);
                    resolve({ success: true, engine: "Gemini Spark AI", data: jsonResult });
                } catch (e) {
                    resolve({ success: false, engine: "Rule Engine Fallback", data: fallbackLeadExtraction(rawMessageText) });
                }
            });
        });

        req.on('error', (err) => {
            resolve({ success: false, engine: "Rule Engine Fallback", data: fallbackLeadExtraction(rawMessageText) });
        });

        req.write(payload);
        req.end();
    });
}

function fallbackLeadExtraction(text) {
    const budgetMatch = text.match(/(?:budget|rm|harga)\s*:?\s*(\d+[\d,]*\s*k?)/i);
    const locationMatch = text.match(/(?:area|lokasi|kat)\s*:?\s*([A-Za-z\s]+)/i);
    return {
        name: "Prospek WhatsApp",
        preferred_location: locationMatch ? locationMatch[1].trim() : "KL & Klang Valley",
        max_budget: budgetMatch ? parseRmValue(budgetMatch[1]) : 500000,
        net_income: 6500,
        commitments: 1800,
        property_type: "Condo / Terrace",
        buying_intent: "High",
        summary: "Prospek berminat melihat listing hartanah."
    };
}

function parseRmValue(str) {
    let clean = str.toLowerCase().replace(/[^0-9k]/g, '');
    if (clean.endsWith('k')) {
        return parseFloat(clean.replace('k', '')) * 1000;
    }
    return parseFloat(clean) || 500000;
}

module.exports = { analyzeLeadWithGeminiSpark, fallbackLeadExtraction };
