const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertEcommerceData } = require('../helpers/db');

const nykaaParse = async (nykaa_data) => {
    try {
        let parsedNykaaData = []
        //console.log('cart intro')

        // Nykaa parsing
        for (let k = 0; k < nykaa_data.length; k++) {
            let y = nykaa_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            //console.log('cart intro3')

            var eventData
            // if (gotData) {
            //     continue
            // }

            // cart screen
            {
                let bag = 'Shopping Bag'
                let mrp = new RegExp(/^₹/gm)
                let payable = new RegExp(/Total/gm)
                let qty = new RegExp(/\d+ml|\d+gm|\d+g|\d+ pcs/gm)
                let delivery = new RegExp(/^Delivery by|^Delivery in/gm)

                //console.log('cart 1')
                // for items in the cart
                if (y.data.includes(bag)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(qty)) {
                            if (!eventData[i - 1].match(qty)) {
                                let itemName = eventData[i - 1];
                                if (itemName === "FREE") {
                                    itemName = eventData[i].replace("Free ", "");
                                }
                                parsedNykaaData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_NAME', itemName, fmtEventTime])
                                s = i + 1
                                while (s < l - 1 && !eventData[s].match(delivery)) {
                                    s += 1
                                }
                                parsedNykaaData.push([y.id, y.user_id, y.app_name, 'CART_DELIVERY_DATE', eventData[s], fmtEventTime])
                                while (s < l - 1 && !eventData[s].match(mrp)) {
                                    s += 1
                                }
                                if (s < l - 1 && eventData[s + 1].match(mrp)) {
                                    parsedNykaaData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_PRICE', eventData[s + 1], fmtEventTime])
                                }
                                else if (s < l) {
                                    parsedNykaaData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_PRICE', eventData[s], fmtEventTime])
                                }
                            }
                        }
                        else if (eventData[i].match(payable)) {
                            if (i < l - 2 && eventData[i + 2].match(mrp)) {
                                parsedNykaaData.push([y.id, y.user_id, y.app_name, 'CART_TOTAL_AMOUNT', eventData[i + 2], fmtEventTime])
                            }
                        }
                    }
                }
            }

            // if (y.id == 160417) {
            //     console.log(y.id)
            // }

            // if (gotData) {
            //     continue
            // }

            // place order screen
            {
                let payment = new RegExp(/Other Payment Options/gm)
                let payable = new RegExp(/Order Total/gm)
                let delivery = new RegExp(/Delivery by|Delivery in/gm)
                let price_details = new RegExp(/Price Details/gm)
                let you_pay = new RegExp(/^Pay ₹/gm)
                let mrp = new RegExp(/^₹/gm)
                let times = new RegExp(/^x \d+/gm)
                if (y.data.match(payment)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(you_pay)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'TOTAL_PAYMENT', eventData[i], fmtEventTime])
                        }
                        else if (i >= 2 && eventData[i].match(delivery)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'DELIVERY_DATE', eventData[i], fmtEventTime])
                            if (i < l - 2 && eventData[i - 1].match(times)) {
                                parsedNykaaData.push([y.id, y.user_id, y.app_name, 'ITEM_NAME', eventData[i - 2], fmtEventTime])
                            }
                            else if (i < l) {
                                parsedNykaaData.push([y.id, y.user_id, y.app_name, 'ITEM_NAME', eventData[i - 1], fmtEventTime])
                            }
                        }
                    }
                }
            }

            // if (gotData) {
            //     continue
            // }

            // order details
            {
                let orders = new RegExp(/Order Confirmed/gm)
                let shipped = new RegExp(/^Shipped/gm)
                let delivered = new RegExp(/^Delivered/gm)
                let qty = new RegExp(/^Qty:/gm)
                let order_id = new RegExp(/^ORDER ID/gm)
                if (y.data.match(orders)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(order_id)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'ORDER_ID', eventData[i + 1], fmtEventTime])
                        }
                        if (eventData[i].match(delivered)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'DELIVERY_DATE', eventData[i + 1], fmtEventTime])
                        }
                        if (eventData[i].match(orders)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'ORDERED_DATE', eventData[i + 1], fmtEventTime])
                        }
                        if (eventData[i].match(shipped)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'DISPATCH_DATE', eventData[i + 1], fmtEventTime])
                        }
                        if (i < l - 3 && eventData[i].match(qty)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'ORDER_ITEM_NAME', eventData[i - 1], fmtEventTime])
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'ORDER_ITEM_PRICE', eventData[i + 3], fmtEventTime])
                        }
                    }
                }


            }

            // my orders screen
            {
                let orders = 'Order Details'
                let delivered = new RegExp(/delivered On/gm)
                let order_id = new RegExp(/^ORDER NUMBER/gm)
                if (y.data.includes(orders)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (i < l - 1 && eventData[i].match(order_id)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'ORDERED_ID', eventData[i + 1], fmtEventTime])
                        }
                        if (eventData[i].match(delivered)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'ORDERED_DELIVERY_DATE', eventData[i], fmtEventTime])
                        }
                    }
                }
            }

            // explore items screen
            {
                let delivery = new RegExp(/^Delivery by/gm)
                let sold = new RegExp(/Sold (b|B)y/gm)
                let similar = new RegExp(/^View Similar/gm)
                let mrp = new RegExp(/^₹/gm)
                let tried = new RegExp(/^Try it On/gm)

                if (y.data.match(sold)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        // if (eventData[i].match(sold)){
                        //     break;
                        // }
                        if (i < l - 5 && eventData[i].match(similar)) {
                            if (eventData[i + 1].match(tried)) {
                                parsedNykaaData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[i + 2], fmtEventTime])
                                if (eventData[i + 5].match(mrp)) {
                                    let price = eventData[i + 5].split(' ')
                                    parsedNykaaData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_PRICE', price[0], fmtEventTime])
                                }
                            }
                            if (!eventData[i + 1].match(tried)) {
                                parsedNykaaData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[i + 1], fmtEventTime])
                                if (eventData[i + 4].match(mrp)) {
                                    let price = eventData[i + 4].split(' ')
                                    parsedNykaaData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_PRICE', price[0], fmtEventTime])
                                }
                            }
                            //console.log('entry price')

                        }
                        else if (eventData[i].match(delivery)) {
                            parsedNykaaData.push([y.id, y.user_id, y.app_name, 'EXPLORE_DELIVERY_DATE', eventData[i], fmtEventTime])
                            break;
                        }

                    }
                }
            }

        }

        if (parsedNykaaData.length > 0) {
            await insertEcommerceData(parsedNykaaData)
        }
        return


    } catch (err) {
        console.log("Nykaa Shopping app parsing error: ", err.message)
        return
    }
}
module.exports = {
    nykaaParse
}