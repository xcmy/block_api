const express = require('express')
const app = express()
const port = 3000
const ForgeSDK = require('@arcblock/forge-sdk')

app.get('/:keyword', function (req, res) {

    let keyword = req.params.keyword
    const query =`
    {
       getAccountState(address:"${keyword}") {
        code
        state {
          address
          balance
          moniker
          migratedTo
          issuer
          migratedFrom
          nonce
          numAssets
          numTxs
          pk
        }
      }
      getAssetState(address: "${keyword}") {
        code
        state {
          address
          consumedTime
          context {
            genesisTime
            renaissanceTime
          }
          issuer
          moniker
          owner
          parent
          readonly
          transferrable
          ttl
        }
      }
      getTx(hash: "${keyword}"){
        info {
          code
          hash
          height
          tags {
            key
            value
          }
          index
          time
          tx {
            chainId
            signatures {
              delegator
              pk
              signature
              signer
            }
          }
        }
        code
      }
    }
    `

    ForgeSDK.connect("https://xenon.abtnetwork.io/api",);
    ForgeSDK.doRawQuery(query)
        .then(data => {
            console.log(data);
            if (data.getAccountState.state != null || data.getAssetState.state != null || data.getTx.info != null){
                // TODO  根据返回数据做解析处理
                res.send( {result: "OK",data:data})
            }else {
                res.send( {result: "OK",data: {}})
            }

        })
        .catch(err => {
            console.log(err)
            res.send({result:"ERR", msg:"查询参数错误"})
        });
})

app.listen(port, (err) => {
    if (!err) console.log(`server start at port ${port}`)
})