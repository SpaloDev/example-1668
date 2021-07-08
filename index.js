/**
 * kintone Webhook Refer Example
 */

const axios = require('axios')

const conf = require('./config.json')

exports.exampleKintoneWebhookRefer = async (req, res) => {

  // check by webhookKey
  if (req.body.webhookKey) {

    if(req.body.webhookKey !== conf.SPALO_WEBHOOK_KEY){
      console.log('webhookKey Error');
      return res.status(401).send('Unauthorized')
    }

  } else {

    return res.send('OK')
  
  }

  const auth = Buffer.from(conf.kintone.loginName + ':' + conf.kintone.loginPassword).toString('base64') 
  const headers = { "X-Cybozu-Authorization": auth }

  async function main() {

    try {

      const instance = axios.create({headers})
      const response = await instance.get('https://' + conf.kintone.subdomain + '.cybozu.com/v1/users.json')
      
      if(response.status === 200){

        const list = []
        for (let i = 0; i < response.data.users.length; i++) {
          list.push({
            label: response.data.users[i].name,
            text: response.data.users[i].code
          })
        }
        
        res.send({
          type: "carousel",
          layout: "button",
          actions:list
        })

      }else{

        res.status(400).send('Error1')
        console.log(response)

      }

    } catch (err) {

      res.status(400).send('Error2')
      console.log(err)
    
    }

  }

  main()

}
