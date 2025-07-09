const now = new Date()
let a = { value: "Haha", expiry: now.getTime() + 6000}

setInterval(()=>{
    const now = new Date()
    if(now.getTime() > a.expiry){
        a = null
    }
    console.log(a)
},1000)