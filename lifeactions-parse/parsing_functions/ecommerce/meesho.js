const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertEcommerceData } = require('../helpers/db');

const meeshoParse = async (meesho_data) => {
    try {
        let parsedMeeshoData = []

        // Meesho parsing
        for (let k = 0; k < meesho_data.length; k++) {
            let y = meesho_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            // console.log('cart intro2')2

            var eventData

            // if (gotData) {
            //     continue
            // }

            // cart screen
            {
                let remove = 'Remove'
                let remove_start = new RegExp(/^Remove/gm)
                let mrp = new RegExp(/^₹/gm)
                let payable = new RegExp(/^VIEW PRICE DETAILS/gm)
                //console.log('cart 1')
                // for items in the cart
                if (y.data.includes(remove)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(remove_start)) {
                            s = i - 1
                            while (s >= 0 && !eventData[s]?.match(mrp)) {
                                s -= 1
                            }
                            if (s >= 2 && eventData[s - 1]?.match(mrp)) {
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_NAME', eventData[s - 2], fmtEventTime])
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_PRICE', eventData[s - 1], fmtEventTime])
                            }
                            else if (s >= 1) {
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_NAME', eventData[s - 1], fmtEventTime])
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_PRICE', eventData[s], fmtEventTime])
                            }
                        }
                        else if (eventData[i].match(payable)) {
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'CART_TOTAL_PRICE', eventData[i - 1], fmtEventTime])

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


            // address screen
            {
                let deliveryScreen = new RegExp(/DELIVERY ADDRESS.*Deliver to this Address/gm)
                if (y.data.match(deliveryScreen)) {
                    parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'DELIVERY_ADDRESS_SCREEN', null, fmtEventTime])
                }

            }

            // payment screen
            {
                let payment = new RegExp(/Select Payment/gm)
                let payable = new RegExp(/Order Total/gm)
                if (y.data.match(payment)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'PAYMENT_SCREEN_VISITED', null, fmtEventTime])
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(payable)) {
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'TOTAL_PAYMENT', eventData[i + 1], fmtEventTime])
                        }

                    }
                }
            }

            // order summary screen
            {
                let summary = new RegExp(/ORDER SUMMARY/gm)
                if (y.data.match(summary)) {
                    parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'ORDER_SUMMARY_SCREEN', null, fmtEventTime])
                }
            }

            // if (gotData) {
            //     continue
            // }

            // order details
            {
                let orders = new RegExp(/Order Details/gm)
                let shipped = new RegExp(/^Your item has been shipped/gm)
                let delivered = new RegExp(/^Your item has been delivered/gm)
                let ordered = new RegExp(/^Your order has been placed/gm)
                let product = new RegExp(/^Product Details/gm)
                if (y.data.match(orders)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(delivered)) {
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'DELIVERY_DATE', eventData[i + 1], fmtEventTime])
                        }
                        if (eventData[i].match(ordered)) {
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'ORDERED_DATE', eventData[i + 1], fmtEventTime])
                        }
                        if (eventData[i].match(shipped)) {
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'DISPATCH_DATE', eventData[i + 1], fmtEventTime])
                        }
                        if (eventData[i].match(product)) {
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'ORDER_ITEM_NAME', eventData[i + 1], fmtEventTime])
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'ORDER_ITEM_PRICE', eventData[i + 2], fmtEventTime])
                        }

                    }
                }


            }


            // my orders screen
            {
                let orders = 'MY ORDERS'
                let delivered = new RegExp(/^Delivered (o|O)n/gm)
                let order_id = new RegExp(/^Order ID/gm)
                if (y.data.includes(orders)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(order_id)) {
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'ORDERED_ID', eventData[i], fmtEventTime])
                        }
                        if (i >= 0 && eventData[i].match(delivered)) {
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_NAME', eventData[i - 1], fmtEventTime])
                            parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'ORDERED_DELIVERY_DATE', eventData[i], fmtEventTime])
                        }
                    }
                }
            }
            // explore items screen
            {
                let cart = new RegExp(/Add to (C|c)art/gm)
                let off = new RegExp(/% off/gm)
                let delivery = new RegExp(/^Estimated/gm)
                let sold = new RegExp(/^Sold (b|B)y/gm)

                if (y.data.match(cart)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(sold)) {
                            break;
                        }


                        if (eventData[i] == "Wishlist" && eventData[i + 1] == "Share") {
                            let mrp = new RegExp(/^₹/gm)
                            s = i - 1;
                            if (eventData[s].match(off)) {
                                while (s > 0 && !eventData[s].match(mrp)) {
                                    s--
                                }
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[s - 1], fmtEventTime])
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_PRICE', eventData[s], fmtEventTime])
                                console.log("1----------", eventData[s - 1], eventData[s]);
                            } else if (eventData[s].match(mrp)) {
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[s - 1], fmtEventTime])
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_PRICE', eventData[s], fmtEventTime])
                                console.log("2----------", eventData[s - 1], eventData[s]);
                            } else {
                                parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[s], fmtEventTime])
                                if (eventData[s + 3].match(mrp)) {
                                    parsedMeeshoData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_PRICE', eventData[s + 3], fmtEventTime])
                                    console.log("3----------", eventData[s], eventData[s + 3]);
                                }
                            }

                        }

                    }
                }
            }

        }

        if (parsedMeeshoData.length > 0) {
            // await insertEcommerceData(parsedMeeshoData)
            // console.log('gotdata')
        }
        return
    } catch (err) {
        console.log("Meesho Shopping app parsing error: ", err.message)
        return
    }
}

module.exports = {
    meeshoParse
}