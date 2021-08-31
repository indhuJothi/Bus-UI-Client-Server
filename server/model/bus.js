const mongoose = require('mongoose')
const busSchema = new mongoose.Schema({
    from : String,
    to:String,
    
})

const Buses =mongoose.model('buses',busSchema)

module.exports=Buses