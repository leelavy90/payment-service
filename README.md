# Payment Service

This is a simple payment service that exposes endpoints to receive payment requests, generate a checkout link, and handle webhook updates for authentication. Upon successful authentication, the API sends a confirmation email to the buyer.

## Usage

update env variables accordingly(use a tunnel service to expose localhost, such as ngrok and update BASE_URL)
run npm install then npm start

### Notes

1. Make sure a local tunnel url is set in env variable BASE_URL
2. Make sure a vendor is created and accepting payments, then create payment with /create-payment endpoint
3. Make sure email is provided in create-payment request
