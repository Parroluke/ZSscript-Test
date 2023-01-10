let pr = new Promise((resolve, reject)=>{
    resolve(1)
}) 
pr.then(console.log('a'))
console.log('b')