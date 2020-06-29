# Senbird Desk - QuickStart for JavaScript

## Introduction

SendBird Desk is a chat customer service platform built on SendBird SDK and API.
Desk JavaScript SDK provides customer-side integration on your own application, so you can easily implement a ticketing system with chat inquiry, inquiries inbox with UI theming.

This repo was made to share a barebones quickstart implementation of how to use SendBird Desk.
It goes through the steps of:

- Connecting to SendBird
- Connecting to SendBird Desk
- Creating a Ticket
- Retrieving Closed Tickets
- Ticket feedback (CSAT)

## Prerequisites

- NodeJS 10.13.x+ along with NPM

## Browser support

- Modern browsers supporting ES6+ (Chrome, FireFox, Edge, Safari, etc)
- IE 11+
- Mobile browsers (Android/iOS)

## Configuration

### 1. Creating a SendBird application.

1. Login or Sign-up for an account at dashboard.
1. Create or select an application on the SendBird Dashboard.
1. Note the Application ID for future reference.
1. Contact sales to get the Desk menu enabled in the dashboard. Sendbird Desk is available only for free-trial or Enterprise plan.

### 2. Build via npm

```
npm install
npm run build
```

## Demo

- npm run demo
- (in browser) http://127.0.0.1:8888

## Reference

Please see the following link for JavaScript Desk SDK Documentation https://github.com/sendbird/SendBird-Desk-SDK-JavaScript
