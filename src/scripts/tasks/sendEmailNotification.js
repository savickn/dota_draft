
import path from 'path';
import nodemailer from 'nodemailer';
import EmailTemplate from 'email-templates';

import config from  '../../server/config/environment';
import env from '../../server/config/local.env';

// create an email to notify User of a price drop for a watchlist Product
// WORKING
export const priceDropEmailer = (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // secure:true for port 465, secure:false for port 587
      auth: {
        user: config.secrets.serverEmail,
        pass: config.secrets.emailPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  
    const email = new EmailTemplate({
      message: {
        from: config.secrets.serverEmail,
      },
      send: true, 
      transport: transporter, 
      // preview: {
      //   open: {
      //     app: 'firefox',
      //     wait: false
      //   }
      // }
    });
    
    return email.send({
      template: path.join(__dirname, '..', '..', 'server', 'templates', 'price-drop'),
      message: {
        to: env.RECEIVER_EMAIL, 
      },
      locals: {
        ...data
      }
    });
  } catch(err) {
    console.error('priceDropEmailer err --> ', err);
  }
}

// basically send the emails
export const sendEmailTask = async (client) => {
  try { 
    while(await client.llen('emailNotifications') > 0) {
      const data = JSON.parse(await client.lpop('emailNotifications'));
      priceDropEmailer(data);
    }
  } catch(error) {
    console.error('checkWatchlists error --> ', error);
  }
}

  /* ALTERNATIVE
  const priceDrops = root.redisClient.lrange('priceChecks', 0, -1); // gets entire list of { productId, newPrice } pairs from DB

  for(let p of priceDrops) {
    Watch.find({ productId: p.productId, targetPrice: { $gte: p.price }})
      .populate('productId', 'url')
      .populate('userId', 'email name')
      .then(watches => {
        console.log('checkWatches --> ', watches);
        for(let w of watches) {
          if(w.shouldEmail) {
            // queue email task
            priceDropEmailer({
              userName: w.userId.name, 
              email: w.userId.email, 
              //productUrl
              vendorUrl: w.productId.url,
              targetPrice: w.targetPrice,
              currentPrice: p.price,  
            });
            //return new Promise(priceDropEmail)
          }
        }
      })
      .catch(err => {
        console.error(err);
      })
  }
  */

/* OLD... using email-templates-v2 */

//import { EmailTemplate } from 'email-templates-v2';

// // create an email to notify User of a price drop for a watchlist Product
// export const priceDropEmailer = (data) => {

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // secure:true for port 465, secure:false for port 587
//     auth: {
//       user: config.secrets.serverEmail,
//       pass: config.secrets.emailPassword
//     }
//   });

//   const templateDir = path.join(__dirname, '..', '..', 'server', 'templates', 'price-drop');
//   const resetEmail = new EmailTemplate(templateDir);

//   const templateData = { 
//     ...data, 
//     // userName --> 
//     // productUrl --> e.g. graph page
//     // vendorUrl --> e.g. GAP page
//     // currentPrice --> 
//     // targetPrice --> 
//   };

//   resetEmail.render(templateData, function (err, result) {
//     console.log('reset email render', result);
//     if(err) return reject(err);
//     var mailOptions = {
//       from: config.secrets.serverEmail,
//       to: env.RECEIVER_EMAIL,
//       //to: req.user.email,
//       subject: 'A product in your watchlist is on sale!',
//       text: result.text,
//       html: result.html
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//       if(error) return reject(error);
//       return resolve(info);
//     });
//   });
// }




