# Rescue Card

Why?
I was in Angigua, Guatemala around Easter 2025 with my wife and friend. We were approached by a man who was clearly very worried and stressed as his phone had just been stolen, I didn't trust him to give over my phone so I got to thinking, if he could present a QR code from his wallet and it had some proof on the page that the info was his, I would trust that enough to message his friend on whatsapp, call his emergency contact or find the person by name on Facebook, this would allow him to get support beoynd just the normal police assistance, he couldnt remember any phone numbers.

## Technical Details

This project is designed to be hosted on Cloudflare Pages, using Wrangler

Note: wrangler will not notice changes to any file except index.js, this is a limitation of wrangler as of June 2025

Framework: ExpressJS

'npm install'
'wrangeler dev'

## Overview

1. Display a web page with a form that the user will enter their rescue data (including an base64 encoded image)
2. Use client side javascript to encrypt the data and send it to the server side endpoint
3. The ExpressJS endpoint will hash the url using the encrypted contents of the file and add the pin to the filename before saving it in R2 (CloudFlare's S3 system).
4. The frontend will receive a success status code with the filename, it will generate a full url to that filename with /cards/ at the start.
5. The ExpressJS endpoint will listen on the /cards/\* endpoint, it will return a web page with a form requesting the users PIN
6. When the user enters the pin, a $.GET call will be made to the endpoint with the pin included which will return the encrypted html file
7. The frontend will then decrypt the file using the PIN and display it to the visitor.

## Purpose

The idea of this system is for the user to save and print and even engrave the QR code to their rescue card and store it in their wallet, car, friends house etc.

If they are in the situation where they have lost their phone but have this code, they can ask a passer-by to scan it, enter the PIN and it will unlock useful information along with proof of their likeness, allowing the stranger to trust the person and contact friends and family.

## Enhancement Opportunities

It could be extended to be used by people who are hurt, this would require the PIN to be guessable after obtaining the QR code, no rate limiting will be implemented for decryption of the rescue card.

Medically useful information could be stored unencrypted so that responders who notice the card can provide care e.g. blood type and medication allergies, the name and photo would also not be encrypted for this to work.

Creating metal cards or printed/NFC tags could be a paid additional service.
