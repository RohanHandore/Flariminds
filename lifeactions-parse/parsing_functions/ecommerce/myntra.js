const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertEcommerceData }=require('../helpers/db');

const myntraParse = async(myntra_data) => {
    try {
        let parsedMyntraData = []

        // myntra parsing
        for (let k = 0; k < myntra_data.length; k++) {
            let y = myntra_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            
            var eventData
            
            // explore items screen
            {   
                let product='product_title'
                let mrp = new RegExp(/^MRP/gm)
                let delivery='Get it by'
                
                if (y.data.includes(product)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {          
                        if (eventData[i].match(product)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[i-1], fmtEventTime])

                        }
                        else if (eventData[i].match(mrp)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_PRICE', eventData[i], fmtEventTime])

                        }
                        else if (eventData[i].includes(delivery)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_DELIVERY_DATE', eventData[i], fmtEventTime])

                        }
                       
                    }
                }
            }

            // if (gotData) {
            //     continue
            // }


            // cart screen
            {
                let items = new RegExp(/ITEMS SELECTED/gm)
                let sold= new RegExp(/^Sold by:/gm)
                let qty= new RegExp(/^Qty/gm)
                
                // for first item in the cart
                if (y.data.match(items)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(sold)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_NAME', eventData[i-2]+' '+eventData[i-1], fmtEventTime])                 
                        }
                        else if (eventData[i].match(qty) && i+3 < l){
                            if (eventData[i+2].includes('left')){
                                parsedMyntraData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_PRICE', eventData[i+3], fmtEventTime])                 
                            }
                            else {
                                parsedMyntraData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_PRICE', eventData[i+2], fmtEventTime])                 
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
                let payment = new RegExp(/PAYMENT OPTIONS/gm)
                let total=new RegExp(/Total Amount/gm)
                let myntra_credit= new RegExp(/Myntra Credit/gm)
                let used= new RegExp(/You used/gm)
                if (y.data.match(payment)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        //If myntra credit is used, we need to add this in database
                        if (i+2 < l && eventData[i].match(myntra_credit) && 
                            eventData[i+1].match(used) ){
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 
                                'MYNTRA_CREDIT_USED', 
                                eventData[i+2], fmtEventTime])
                        }
                        if (i+1 < l && eventData[i].match(total)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 
                            'TOTAL_AMOUNT_ORDER', 
                            eventData[i+1], fmtEventTime])
                        }
                    }
                }
            }

            // if (gotData) {
            //     continue
            // }

            // my orders screen
            {
                let orders = new RegExp(/ORDERS/gm)
                let filter=new RegExp(/FILTER/gm)
                let delivered = new RegExp(/^Delivered/gm)
                let confirmed=new RegExp(/Confirmed/gm)
                let size=new RegExp(/^Size:/gm)
                let cancelled= new RegExp(/^Cancelled/gm)
                let refund=new RegExp(/^Refund/gm)
                if (y.data.match(orders) &&
                    y.data.match(filter)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (i+1 < l && eventData[i].match(delivered)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_DELIVERY_DATE', eventData[i+1], fmtEventTime])
                        }
                        if (i+1 < l && eventData[i].match(confirmed)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_ARRIVING_DATE', eventData[i+1], fmtEventTime])
                        }
                        if (i+1 < l && eventData[i].match(cancelled)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_CANCELLED_DATE', eventData[i+1], fmtEventTime])
                        }
                        if (eventData[i].match(refund)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'REFUNDED', null, fmtEventTime])
                        }
                        if (eventData[i].match(size)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_NAME', eventData[i-2]+' '+eventData[i-1], fmtEventTime])
                        }                     
                    }
                }
            }
            // order details
            {
                let orders = new RegExp(/ORDERS/gm)
                let help=new RegExp(/Help/gm)
                let delivered = new RegExp(/^Delivered/gm)
                let size=new RegExp(/^Size:/gm)
                let cancelled= new RegExp(/^Cancelled/gm)
                let refund=new RegExp(/^Refund/gm)
                let price= new RegExp(/Order Price/gm)
                let order_id=new RegExp(/Order ID/gm)
                if (y.data.match(orders) &&
                    y.data.match(help)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (i+1 < l && eventData[i].match(delivered)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_DELIVERY_DATE', eventData[i+1], fmtEventTime])
                        }
                        if (i+1 < l && eventData[i].match(cancelled)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_CANCELLED_DATE', eventData[i+1], fmtEventTime])
                        }
                        if (eventData[i].match(refund)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'REFUNDED', null, fmtEventTime])
                        }
                        if (eventData[i].match(size)) {
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_NAME', eventData[i-2]+ ' '+eventData[i-1], fmtEventTime])
                        }
                        if (i+1 < l && eventData[i].match(price)){
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_PRICE', eventData[i+1], fmtEventTime])
                        }
                        if (eventData[i].match(order_id)){
                            parsedMyntraData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_NUMBER', eventData[i], fmtEventTime])
                        }

                        
                    }
                }
            }
        }
        
        if (parsedMyntraData.length > 0) {
            await insertEcommerceData(parsedMyntraData)
        }
        return
    
        
    } catch(err) {
        console.log("Myntra Shopping app parsing error: ", err.message)
        return
    }
}

module.exports = {
     myntraParse
}