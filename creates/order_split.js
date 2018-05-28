const sample = require("../samples/sample_order");
const common = require("../common");
const _ = require("lodash");

const splitOrder = (z, bundle) => {
    const objID = bundle.inputData.id;

    // It turns out that Zapier uses Django-style template tags ("{{" and "}}") for its own
    // templating when building out text fields in the Zapier UI, so we have to avoid using them.
    // Double brackets are visually close enough, and we just swap them out here.
    const t = (bundle.inputData.group_by_template || "").
          replace("[[", "{{").
          replace("]]", "}}");

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
        let splits = z.JSON.parse(response.content)["split_orders"];
        return _.keyBy(splits, (s) => s.group);
    });
};

const baseSplitAction = () => {
    return {
        noun: "Order",

        operation: {
            inputFields: [
                {
                    key: "id",
                    label: "ID",
                    required: true
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
                {
                    key: "ignore_clones",
                    label: "Ignore clones",
                    helpText: "Do not re-clone orders that are themselves clones. " +
                        "Safeguards against runaway cloning loops, disable with care!",
                    type: "boolean",
                    required: true,
                    default: "yes",
                },
            ],
            perform: splitOrder,
            sample: sample,
        }
    };
};

/**
 *  The split action uses a template.
 */
let splitAction = Object.assign(baseSplitAction(), {
    key: "order_split",
    display: {
        label: "Split Order",
        description: "Splits an order by a user-defined key."
    },
});

splitAction.operation.inputFields.splice(1, 0, {
    key: "group_by_template",
    label: "Template to group lines by. If empty, order will just be copied.",
    default: "[[ line.item.manufacturer.id ]]",
    required: true,
});

/**
 *  The copy action is just the split action with an empty template.
 */
const copyAction = Object.assign(baseSplitAction(), {
    key: "order_copy",
    display: {
        label: "Copy Order",
        description: "Makes a copy of an existing order."
    },
});


module.exports = {
    order_split: splitAction,
    order_copy: copyAction,
};
