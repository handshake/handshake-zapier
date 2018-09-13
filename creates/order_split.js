const sample = require("../samples/sample_create_order_copy");
const common = require("../common");
const _ = require("lodash");

const splitOrder = (z, bundle) => {
    const objID = bundle.inputData.id;
    let t = TEMPLATES[bundle.inputData.operation] || bundle.inputData.group_by_template || "";

    // It turns out that Zapier uses Django-style template tags ("{{" and "}}") for its own
    // templating when building out text fields in the Zapier UI, so we have to avoid using them.
    // Double brackets are visually close enough, and we just swap them out here.
    t = t.replace("[[", "{{").replace("]]", "}}");

    return z.request({
        method: "POST",
        url: `${common.apiURL(bundle)}/orders/${objID}/actions/split`,
        body: JSON.stringify({
            group_by_template: t,
            new_status: bundle.inputData.new_status,
            new_category_id: bundle.inputData.new_category_id,
            keep_original: !!bundle.inputData.keep_original,
            ignore_clones: !!bundle.inputData.ignore_clones,
        }),
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        let splits = z.JSON.parse(response.content)["split_orders"];
        return _.keyBy(splits, (s) => s.group);
      } else {
        errorMsg = z.JSON.parse(response.content).__all__[0];
        throw new Error(errorMsg);
      } 
    });
};

const COPY_ORDER = "Copy order";
const SPLIT_BY_MFR = "Split by manufacturer";
const SPLIT_BY_BACKORDER = "Split in-stock vs backorder";
const CUSTOM_SPLIT = "Custom split";

const TEMPLATES = {
    [COPY_ORDER]: "",
    [SPLIT_BY_MFR]: "[[ line.item.manufacturer.id ]]",
    [SPLIT_BY_BACKORDER]: "{% if line.stockUnit.shelfQty > 0 %}in_stock{% else %}backorder{% /if %}",
};

const splitAction = {
    noun: "Order",
    key: "order_split",

    display: {
        label: "Copy/Split Order",
        description: "Copies or splits an order by a user-defined key."
    },

    operation: {
        inputFields: [
            {
                key: "id",
                label: "Order ID",
                helpText: "The order must already exist in Handshake.",
                required: true
            },
            {
                key: "operation",
                label: "Operation",
                required: true,
                altersDynamicFields: true,
                default: COPY_ORDER,
                choices: [
                    COPY_ORDER,
                    SPLIT_BY_MFR,
                    SPLIT_BY_BACKORDER,
                    CUSTOM_SPLIT,
                ],
            },
            (z, bundle) => {
                if (bundle.inputData.operation === CUSTOM_SPLIT) {
                    return [{
                        key: "group_by_template",
                        label: "Template to group lines by. If empty, order will just be copied.",
                        helpText: "For example, to split by manufacturer enter [[ line.item.manufacturer.id ]]",
                        default: "[[ line.item.manufacturer.id ]]",
                    }];
                } else {
                    return [];
                }
            },
            {
                key: "new_status",
                label: "New Order Status",
                choices: {
                    "New": "New",
                    "Hold for confirm": "Hold for confirm",
                    "Confirmed": "Confirmed",
                    "Processing": "Processing",
                    "Complete": "Complete",
                },
            },
            {
                key: "new_category_id",
                label: "New Order Category ID",
                dynamic: "order_category.id.name",
            },
            {
                key: "keep_original",
                label: "Keep original order after copy/split",
                type: "boolean",
                required: true,
                default: "yes",
            },
            // {
            //     key: "ignore_clones",
            //     label: "Ignore clones",
            //     helpText: "Do not re-clone orders that are themselves clones. " +
            //         "Safeguards against runaway cloning loops, disable with care!",
            //     type: "boolean",
            //     required: true,
            //     default: "yes",
            // },
        ],
        perform: splitOrder,
        sample: sample,
        outputFields: [
            {key: "objID", label: "ID"},
            {key: "totalAmount", label: "Total Amount"},
            {key: "customer", label: "Customer"},
            {key: "lines", label: "Lines"},
        ],
    }
};

module.exports = splitAction;
