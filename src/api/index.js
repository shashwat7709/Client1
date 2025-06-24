"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var twilio_1 = require("twilio");
var router = express_1.default.Router();
// Add your non-MongoDB routes here
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
var whatsappTo = 'whatsapp:+918668945632';
var client = accountSid && authToken ? (0, twilio_1.default)(accountSid, authToken) : null;
exports.default = router;
