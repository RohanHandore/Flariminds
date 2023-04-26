const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertEcommerceData }=require('../helpers/db');

const jiomartParse = async(jiomart_data) => {
    try {
        let parsedJiomartData = []

        // Jiomart parsing
        for (let k = 0; k < jiomart_data.length; k++) {
            let y = jiomart_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
           // console.log('cart intro2')

            var eventData
            
            
            
            // if (gotData) {
            //     continue
            // }

        
            // cart screen
            {
                let save = 'save for later'
                let you_save= new RegExp(/^You Save/gm)
                let payable= new RegExp(/^Total$/gm)
                //console.log('cart 1')
                // for items in the cart
                if (y.data.toLowerCase().includes(save)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(you_save)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_NAME', eventData[i-3], fmtEventTime])     
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'CART_ITEM_PRICE', eventData[i-2], fmtEventTime])                 
                        }
                        if (i+1 < l && eventData[i].match(payable)){
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'CART_TOTAL_PRICE', eventData[i+1], fmtEventTime])     
                            
                        }
                    }
                }
            }
            
            // if (gotData) {
            //     continue
            // }
                
            // place order screen
            {
                let payment = new RegExp(/Delivery Address/gm)
                let payable=new RegExp(/Payable Amount/gm)
                let you_save= new RegExp(/You Save/gm)
                let delivery=new RegExp(/Delivery Between/gm)
                let delivery2= new RegExp(/Delivery (B|b)y/gm)
                if (y.data.match(payment)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(you_save)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDER_ITEM_NAME',eventData[i-3], fmtEventTime])
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDER_ITEM_PRICE',eventData[i-2], fmtEventTime])
                        }
                        else if (eventData[i].match(delivery)
                                || eventData[i].match(delivery2)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDER_DELIVERY_DATE', eventData[i], fmtEventTime])
                        }
                        else if (i+1 < l && eventData[i].match(payable)){
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'TOTAL_ORDER_PAYMENT', eventData[i+1], fmtEventTime])
                        }
                    }
                }
            }
            
            // if (gotData) {
                //     continue
                // }
                
            // my orders screen
            {
                let orders = 'Orders'
                let mrp=new RegExp(/^₹/gm)
                let filter='Filter'
                let delivered = new RegExp(/^Delivered/gm)
                let confirmed=new RegExp(/Confirmed/gm)
                let size=new RegExp(/^Size:/gm)
                let items = new RegExp(/[0-9]* item/gm)
                let cancelled= new RegExp(/^Cancelled/gm)

                if (y.data.includes(orders) && y.data.includes(filter)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(mrp)){
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDERED_AMOUNT', eventData[i], fmtEventTime])
                        }
                        if (eventData[i].match(delivered) || eventData[i].match(confirmed) || eventData[i].match(cancelled)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDERED_DELIVERY_DATE', eventData[i], fmtEventTime])
                            s = i+3
                            while (s < l && !eventData[s].includes('View Details')) {
                                if (eventData[s].match(items)) {
                                    parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEMS', eventData[s], fmtEventTime])    
                                }
                                parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_NAME', eventData[s], fmtEventTime])
                                s += 1
                            }
                        }
                    }
                }
            }
            
            // order details
            {
                let orders = new RegExp(/Track (O|o)rder/gm)
                let shipped=new RegExp(/^(S|s)hipped/gm)
                let delivered = new RegExp(/^Delivered (O|o)n/gm)
                let ordered=new RegExp(/^Ordered/gm)
                let order_id=new RegExp(/^Order Number/gm)
                let qty= new RegExp(/^Qty/gm)
                let reorder= new RegExp(/Reorder/gm)
                if (y.data.match(orders)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(delivered)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'DELIVERY_DATE', eventData[i], fmtEventTime])
                        }
                        if (eventData[i].match(ordered)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDERED_DATE', eventData[i+1], fmtEventTime])
                        }
                        if (eventData[i].match(shipped)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'DISPATCH_DATE', eventData[i+1], fmtEventTime])
                        }
                        if (eventData[i].match(order_id)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDER_NUMBER', eventData[i+1] ,fmtEventTime])
                        }
                
                    }
                }
                
                else if (y.data.match(reorder)){
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(qty)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_NAME', eventData[i-2], fmtEventTime])
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'ORDERED_ITEM_PRICE', eventData[i-1], fmtEventTime])
                        }
       
                    }
                }
            }

            // explore items screen
            {   
                let sold=new RegExp(/Sold (B|b)y/gm)
                let slide=new RegExp(/^Go to slide 1/gm)
                let mrp = new RegExp(/^₹/gm)
                let delivery='CHECK'
                let similar='Similar Products'
                let payment='Make Payment'
                let basket ='Basket'
                
                if ((y.data.match(sold)||
                    y.data.includes('In Stock')) 
                    && !y.data.includes('SAVE FOR LATER')
                    && !y.data.includes('Payable Amount')
                    && !y.data.includes(payment)
                    && !y.data.includes(basket)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].includes(similar) ||
                            eventData[i].includes('More') || 
                            eventData[i].includes("Don't Forget to Add")){
                            break;
                        }
                        if (eventData[i].match(slide)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_NAME', eventData[i-1], fmtEventTime])

                        }
                        else if (eventData[i].match(mrp)) {
                            parsedJiomartData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_PRICE', eventData[i], fmtEventTime])

                        }
                        else if (eventData[i].includes(delivery)) {
                            if((i+1<l) && eventData[i+1].includes('Between')
                              || eventData[i+1].includes('Delivery by')){
                                parsedJiomartData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_DELIVERY_DATE', eventData[i+1], fmtEventTime])

                            }
                        }
                        else if (eventData[i].includes('Additional Services')){
                            i+=1
                            while (eventData[i].match(mrp)){
                                parsedJiomartData.push([y.id, y.user_id, y.app_name, 'EXPLORE_ITEM_ADDITIONAL_SERVICES', eventData[i], fmtEventTime])
                                i+=1
                            }
                            

                        }
                       
                    }
                }
            }
        }
        
        if (parsedJiomartData.length > 0) {
            await insertEcommerceData(parsedJiomartData)
        }
        return
    
        
    } catch(err) {
        console.log("Myntra Shopping app parsing error: ", err.message)
        return
    }
}

module.exports = {
     jiomartParse
}