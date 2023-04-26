const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertEcommerceData }=require('../helpers/db');

const amazonShoppingParse = async(amazon_data) => {
    try {
        let parsedAmazonData = []

        // amazon parsing
        for (let k = 0; k < amazon_data.length; k++) {
            let y = amazon_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            
            var eventData
            
            // explore items screen
            {
                let rating = new RegExp(/\d.\d out of \d stars/gm)
                if (y.data.match(rating)) {

                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    let exploreItem = false
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(rating)) {
                            i += 2
                            if (eventData[i].includes("Reviews")) {
                                i++
                                // confirming exploring item screen
                                exploreItem = true
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[i], fmtEventTime])
                            }
                        }
                        if (exploreItem) {
                            if (eventData[i].includes('M.R.P.')) {
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_MRP', eventData[i], fmtEventTime])
                            }
                            if (eventData[i].includes('%')) {
                                if (eventData[i].includes('off')) {
                                    parsedAmazonData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_DISCOUNT', eventData[i], fmtEventTime])    
                                } else if (eventData[i].includes('₹')) {
                                    parsedAmazonData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_DISCOUNTED_PRICE', eventData[i], fmtEventTime])
                                }
                            }
                            if (eventData[i].includes('delivery')) {
                                i++
                                if (eventData[i] == ' ') {
                                    i++
                                }
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_ESTIMATE_DELIVERY', eventData[i], fmtEventTime])
                            }
                        }
                    }
                }
            }

            // if (gotData) {
            //     continue
            // }


            // cart screen
            {
                let proceedToBuy = new RegExp(/Proceed to Buy/gm)
                let sendAsGift = new RegExp(/Send as a gift/gm)
                let saveForLater = new RegExp(/Save for later$/gm)
                // for first item in the cart
                if (y.data.match(proceedToBuy)) {

                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(proceedToBuy)) {
                            i++
                            if (eventData[i].match(sendAsGift)) {
                                i++
                                if (eventData[i].match(sendAsGift)) {
                                    i++
                                }
                                if (eventData[i].includes('Delete')) {
                                    i++
                                    parsedAmazonData.push([y.id, y.user_id, y.app_name, 'CART_ITEM', eventData[i], fmtEventTime])
                                    while (!eventData[i].includes('₹')) {
                                        i++
                                    }
                                    parsedAmazonData.push([y.id, y.user_id, y.app_name, 'ITEM_PRICE', eventData[i], fmtEventTime])
                                }
                            }
                        }
                        if (eventData[i].match(saveForLater)) {
                            i++
                            if (eventData[i].includes('Delete')) {
                                i++
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'CART_ITEM', eventData[i], fmtEventTime])
                                while (!eventData[i].includes('₹')) {
                                    i++
                                }
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'ITEM_PRICE', eventData[i], fmtEventTime])
                            }
                        }
                    }
                }
            }

            // if (gotData) {
            //     continue
            // }

            // place order screen
            {
                let orderNow = new RegExp(/Order now/gm)
                let shipping = new RegExp(/Shipping/gm)

                if (y.data.match(orderNow)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    var placingOrderScreen = false
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(orderNow)) {
                            i++
                            if (eventData[i].match(shipping)) {
                                placingOrderScreen = true
                                break
                            }
                        }
                    }
                    if (placingOrderScreen) {
                        for (let i = 0; i < l; i++) {
                            if (eventData[i].includes('Order Total')) {
                                i++
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PLACING_ORDER_TOTAL', eventData[i], fmtEventTime])
                            }
                            if (eventData[i].includes('Pay with')) {
                                i++
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PLACING_ORDER_PAYMENT_TYPE', eventData[i], fmtEventTime])
                            }
                            if (eventData[i].includes('Get it by')) {
                                i++
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PLACING_ORDER_ESTIMATED_DELIVERY', eventData[i], fmtEventTime])
                            }
                            if (eventData[i].includes('Details')) {
                                i++
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PLACING_ORDER_ITEM_NAME', eventData[i], fmtEventTime])
                            }
                            if (eventData[i].includes('You Save')) {
                                i--
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PLACING_ORDER_ITEM_PRICE', eventData[i], fmtEventTime])
                                i++
                            }
                        }
                    }
                }
            }

            // if (gotData) {
            //     continue
            // }

            // my orders screen
            {
                let orders = new RegExp(/Your Orders/gm)
                let delivered = new RegExp(/^Delivered/gm)
                let ordered = new RegExp(/^Ordered/gm)
                let arriving = new RegExp(/^Arriving/gm)
                let threeMonths = new RegExp(/Past three months/gm)
                let endOfOrders = new RegExp(/end of Your Orders/gm)

                if (y.data.match(orders)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    var placingOrderScreen = false
                    let threeMonthsOrders = false
                    let endOfOrdersIndex = -1
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(threeMonths)) {
                            threeMonthsOrders = true
                        }
                        if (eventData[i].match(delivered) || eventData[i].match(ordered) || eventData[i].match(arriving)) {
                            i--
                            parsedAmazonData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_NAME', eventData[i], fmtEventTime])
                            i++
                            parsedAmazonData.push([y.id, y.user_id, y.app_name, 'ORDERED_DELIVERY_STATUS', eventData[i], fmtEventTime])
                        }
                        if (eventData[i].match(endOfOrders)) {
                            endOfOrdersIndex = i
                        }
                    }
                    if (threeMonthsOrders) {
                        for (let i = endOfOrdersIndex - 1; i >= 0; i--) {
                            if (eventData[i].match(delivered) || eventData[i].match(ordered) || eventData[i].match(arriving)) {
                                break
                            } else {
                                parsedAmazonData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_NAME', eventData[i], fmtEventTime])
                            }
                        }
                    }
                }
            }

            // order details
            {
                let orderDetails = new RegExp(/View order details/gm)
                let orderDate = new RegExp(/^Order date/gm)
                let orderNo = new RegExp(/^Order #/gm)
                let delivery = new RegExp(/^Delivery Estimate/gm)
                let shipped = new RegExp(/^Shipped/gm)

                if (y.data.match(orderDetails)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(orderDate)) {
                            i++
                            parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_DATE', eventData[i], fmtEventTime])
                        }
                        if (eventData[i].match(orderNo)) {
                            i++
                            parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_NUMBER', eventData[i], fmtEventTime])
                        }
                        if (eventData[i].includes('Order total')) {
                            i++
                            parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_TOTAL_AMOUNT', eventData[i], fmtEventTime])
                        }
                        if (eventData[i].match(delivery) || eventData[i].match(shipped)) {
                            i++
                            parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_DELIVERY_DATE', eventData[i], fmtEventTime])
                            for (let j = 0; j < l; j++) {
                                if (eventData[i].includes('Qty')) {
                                    j -= 2
                                    parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_ITEM_NAME', eventData[i], fmtEventTime])
                                    j++
                                    parsedAmazonData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_ITEM_PRICE', eventData[i], fmtEventTime])
                                    j++
                                }
                            }
                        }
                    }
                }
            }
        }
        
        if (parsedAmazonData.length > 0) {
            await insertEcommerceData(parsedAmazonData)
        }
        return
        
    } catch(err) {
        console.log("Amazon Shopping app parsing error: ", err.message)
        return
    }
}

module.exports = {
    amazonShoppingParse
}