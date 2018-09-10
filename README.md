# handshake-zapier

An example app that helps kickstart your journey as a Zapier [developer](https://zapier.com/developer/). Once logged in, you can see the tutorial itself [here](https://zapier.com/developer/start/introduction).

Based on examples from Zapier [here](https://github.com/zapier/zapier-platform-cli).

## Our Implementation
The current, reviewed version of the zapier application is version 1.1.5. The review process from Zapier is long and nit-picky, so we've greatly simplified our app with the expectation that we can add in more actions later with a less strict review. They are very protective of the Zapier UX, though, which is beneficial in that the actions we expose here are generally pretty straightforward and include few inputs.

### Triggers
1. **New Customer** - triggers when a new customer is created. When this happens in Handshake Hub, the customer details are always blank, since we save first to get an object ID, then update the customer later. 
1. **New Order** - triggers when a new order is created. When this happens in Handshake Hub, the order is always blank, since we save first to get an object ID, then update the order again later.
1. **Order Status Changed** - triggers whenever an order changes status. There is a filter on this action, so that the user can chose to listen to orders entering one specific status (e.g., trigger this zap when an order changes to 'Confirmed').  If the filter is left blank, then any status change will trigger the zap.

### Creates
1. **Export Order** - sends a `POST` request to the `/orders/{orderID}/actions/export?format={format}` endpoint. The zapier user can chose the type of export to trigger (either CSV/HTML). It also requires an Order ID from Handshake.
1. **Update Order Status** - first `GET`s the current order status, then sends a `POST` to the `/orders/{orderID}/actions/changeStatus` endpoint with the old status, and a new status that a user can choose from a dropdown. It also requires an Order ID from Handshake.
1. **Update Order Category** - first `GET`s the current order, then overwrites the order category with a value chosen by the user. The category list is updated `GET`ing from the `/order_categories` endpoint, and presenting the user with a dynamic list. It also requires an Order ID from Handshake.
1. **Create Customer** - sends a `POST` request to the `/customers` endpoint that includes an id, name, contact, email, and customer group. Name, Contact, and Email are required. An ID will be randomly generated if no ID is provided.
1. **Email Order Confirmation** - sends a `POST` request to the `/orders/{orderID}/actions/send_email` endpoint. The zapier user can specify the TO and CC emails; otherwise, we use the defaults on the account. It also requires an Order ID from Handshake.
1. **Copy/Split Order** - sends a `POST` request to the `/orders/{orderID}/actions/split` endpoint, which will split an order based on a Handlebars template, or copy the order. There are several input fields. It also requires an Order ID from Handshake:
    1. Operation - either 'Copy Order', 'Split by Manufacturer', or 'Split In-Stock Vs Backorder'. Users can also write a custom split template, which requires writing their own Handlebars.
    1. New Order Status - status for the copied or split orders. Either New, Hold For confirm, Processing, Confirmed, or Complete.
    1. New Order Category ID - dynamic dropdown, which issues a `GET` to the `/order_categories` endpoint, and then lets the user select an option.
    1. Keep original order after copy/split - will either delete the original order, or leave it untouched after the operation has finished.

## Next Steps
This app is currently (as of 9/10) in review by Zapier, and hopefully published in the next few days. 

1. Implement more robust error handling. As of now, it's not very DRY or smart (it only surfaces the first error, if our API returns multiple, for instance).
1. Generally refactor and review the code, since this hasn't gone through a formal review process yet.
1. Create app templates. Some common ones would be:
    1. Update Handshake order status when new Shipstation shipment is created
    1. Create/update customer in any CRM when a new customer is created in Handshake - Zoho, Hubspot, DynamicsCRM, Highrise, Insightly, SugarCRM seem like good targets
    1. Create/update contact in any marketing automation when a new customer is created in Handshake - Constant Contact, Pardot, ActiveCampaign, 
    1. Create items in Handshake when a new item is created in Podia
