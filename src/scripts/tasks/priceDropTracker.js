

//import redis_client from '../redis';
import Watch from '../../server/api/Watch/watch.model';
import { priceDropEmailer } from './sendEmailNotification';


// compare 'priceChecks' from Redis cache to watchlists and send email if necessary
export const checkWatchlists = async (client) => {
  try { 
    while(await client.llen('priceChecks') > 0) {
      const p = JSON.parse(await client.lpop('priceChecks'));
      console.log('price --> ', p);
  
      const watches = await Watch.find({ productId: p.productId, targetPrice: { $gte: p.price }})
                                .populate('productId', 'url')
                                .populate('userId', 'email name')
      console.log('watches --> ', watches);
      
      for(let w of watches) {
        if(w.shouldEmail) {

          const data = {
            userName: w.userId.name, 
            email: w.userId.email,
            // productUrl ??
            vendorUrl: w.productId.url,
            targetPrice: w.targetPrice,
            currentPrice: p.price, 
          };

          // queue email task
          await client.lpush('emailNotifications', JSON.stringify(data));
          
          // priceDropEmailer(data);
        }
      }
    }
  } catch(error) {
    console.error('checkWatchlists error --> ', error);
  }
}