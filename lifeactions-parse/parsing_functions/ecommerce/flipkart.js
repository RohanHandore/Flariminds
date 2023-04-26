const { eventTimeFmt }= require('../helpers/event_time_fmt');
const { insertEcommerceData }=require('../helpers/db');

const flipkartParse = async(flipkart_data) => {
    try {
        let parsedFlipkartData = []
        // flipkart parsing
        for (let k = 0; k < flipkart_data.length; k++) {
            let y = flipkart_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            
            var eventData
            
            // explore items screen
            {
                let rating = new RegExp(/ratings/gm)
                let delivery = new RegExp(/^Delivery/gm)
                let price = new RegExp(/^₹/gm)
                if (y.data.match(rating)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
    
                    let exploreItem = false
                    let i = 0
                    for (i = 0; i < l; i++) {
                        if (eventData[i].match(rating)) {
                            i--
                            exploreItem = true
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[i], fmtEventTime])
                            i++
                            break
                        }
                    }
                    if (exploreItem) {
                        for (let j = i; j < l; j++) {
                            if (eventData[j].match(delivery)) {
                                parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_DELIVERY_ESTIMATE', eventData[j], fmtEventTime])
                                break
                            }
                            if (eventData[j].includes('off')) {
                                parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'ITEM_DISCOUNT', eventData[j], fmtEventTime])
                            } else if (eventData[j].match(price)) {
                                parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_PRICE', eventData[j], fmtEventTime])
                            }
                        }
                    }
                }
            }
    
            // if (gotData) {
            //     continue
            // }
    
            // add to cart
            {
                let addToCart = new RegExp(/added to the cart/gm)
                if (y.data.match(addToCart)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
    
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(addToCart)) {
                            i++
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'ITEM_ADDED_TO_CART', eventData[i], fmtEventTime])
                        }
                    }
                }
            }
    
            // if (gotData) {
            //     continue
            // }
    
            // cart screen
            {
                let myCart = new RegExp(/My Cart/gm)
                let rating = new RegExp(/^\([0-9,]*\)$/gm)
                let price = new RegExp(/^₹/gm)
                let totalAmt = new RegExp(/^Total Amount$/gm)
                let delivery = new RegExp(/^Delivery by/gm)
                let remove = new RegExp(/^Remove/gm)
                let buyThisNow = new RegExp(/^Buy this now/gm)
                let bestseller = new RegExp(/^BESTSELLER/gm)
                // for first item in the cart
                if (y.data.match(myCart)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
    
                    let gotItemPrice = false
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(rating)) {
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'CART_ITEM', eventData[i - 2], fmtEventTime])
                            gotItemPrice = false
                        }
                        if (!gotItemPrice && eventData[i].match(price)) {
                            i++
                            if (i < l && !eventData[i].match(price)) {
                                i--
                            }
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_PRICE', eventData[i], fmtEventTime])
                            gotItemPrice = true
                        }
                        if (eventData[i].match(delivery)) {
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_ESTIMATE_DELIVERY', eventData[i], fmtEventTime])
                        }
                        if (eventData[i].match(remove)) {
                            i++
                            if (eventData[i].match(buyThisNow)) i++
                            if (eventData[i].match(bestseller)) i++
                            if (i < l && !eventData[i].includes('Price Details')) {
                                parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_NAME', eventData[i], fmtEventTime])
                            }
                        }
                        if (eventData[i].match(totalAmt)) {
                            i++
                            if (i < l && eventData[i].includes('₹')) {
                                parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'CART_ITEMS_TOTAL_AMT', eventData[i], fmtEventTime])
                            }
                        }
                    }
                }
            }
    
            // my orders screen
            {
                let orders = new RegExp(/My Orders/gm)
                let delivered = new RegExp(/^Delivered on/gm)
                let refund = new RegExp(/^Refund/gm)
                let cancelled = new RegExp(/^Cancelled/gm)
                if (y.data.match(orders)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
    
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(delivered) || eventData[i].match(refund) || eventData[i].match(cancelled)) {
                            i++
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_ITEM_NAME', eventData[i], fmtEventTime])
                            i--
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_DELIVERY_STATUS', eventData[i], fmtEventTime])
                            i++
                        }
                    }
                }
            }
    
            // if (gotData) {
            //     continue
            // }
    
            // order details
            {
                let orderDetails = new RegExp(/Order Details/gm)
                let orderId = new RegExp(/^Order ID/gm)
                let orderDate = new RegExp(/^Order date/gm)
                let orderNo = new RegExp(/^Order #/gm)
                let delivery = new RegExp(/^Delivery Estimate/gm)
                let shipped = new RegExp(/^Shipped/gm)
    
                if (y.data.match(orderDetails)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
    
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(orderId)) {
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_ID', eventData[i], fmtEventTime])
                            i++
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_ITEM_NAME', eventData[i], fmtEventTime])
                        }
                        if (i < l && eventData[i].includes('Order Confirmed')) {
                            i++
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_DATE', eventData[i], fmtEventTime])
                        }
                        if (i < l && eventData[i].includes('Your item has been delivered')) {
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_DELIVERED', null, fmtEventTime])
                        }
                        if (i < l && eventData[i].includes('Cancelled')) {
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_CANCELLED', null, fmtEventTime])
                        }
                        if (i< l && eventData[i].includes('Return')) {
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_RETURNED', null, fmtEventTime])
                            i++
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_RETURN_DATE', eventData[i], fmtEventTime])
                        }
                        if (i < l && eventData[i].match(orderDate)) {
                            i++
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_DATE', eventData[i], fmtEventTime])
                        }
                        if (i < l && eventData[i].match(orderNo)) {
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_NUMBER', eventData[i], fmtEventTime])
                        }
                        if (i < l && eventData[i].includes('Order total')) {
                            i++
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_TOTAL_AMOUNT', eventData[i], fmtEventTime])
                        }
                        if (i < l && (eventData[i].match(delivery) || eventData[i].match(shipped))) {
                            i++
                            parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_DELIVERY_DATE', eventData[i], fmtEventTime])
                        }
                        if (i < l && eventData[i].includes('Total Amount')) {
                            i++
                            if (eventData[i].includes('₹')) {
                                parsedFlipkartData.push([y.id, y.user_id, y.app_name, 'PAST_ORDER_ITEM_PRICE', eventData[i], fmtEventTime])
                            }
                        }
                    }
                }
            }
        }
        
        if (parsedFlipkartData.length > 0) {
            await insertEcommerceData(parsedFlipkartData)
        }
    } catch (error) {
        console.log('flipkart parsing error: ', error.message)
    }

}

module.exports = {
    flipkartParse
}