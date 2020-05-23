const express = require('express')
const app = express()
const port = 3000

const requestRecord = function (req, res, next) {
  const dateInstance = new Date
  const reqTime = dateInstance.valueOf()
  // dateInstance.toISOString().slice(0, 10)) // YYYY-MM-DD
  // dateInstance.valueOf()) // timestamp
  const date = `${dateInstance.getFullYear()}-${dateInstance.getMonth() + 1}-${dateInstance.getDate()} ${dateInstance.getHours()}:${dateInstance.getMinutes()}:${dateInstance.getSeconds()}`

  next()
  res.end()
  res.on('finish', function () {
    const resTime = Date.now()
    const totalTime = resTime - reqTime
    console.log(`${date} | ${req.method} from ${req.url} | total time: ${totalTime}ms | status: ${res.statusCode}`)
  })

}
app.use(requestRecord)

app.get('/', (req, res) => {
  res.send('列出全部 Todo')
})

app.get('/new', (req, res) => {
  res.send('新增 Todo 頁面')
})

app.get('/:id', (req, res) => {
  res.send('顯示一筆 Todo')
})

app.post('/', (req, res) => {
  res.send('新增一筆  Todo')
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})

/** writting middleware **

 如果第一個路由最後未呼叫 next() 則中斷循環，不會進入第二個路由
 app.get('/user/:id', function (req, res, next) {
   console.log('ID:', req.params.id)
   next()
 }, function (req, res, next) {
   res.send('User Info')
   // next()
 })
 app.get('/user/:id', function (req, res, next) {
   console.log('end')
   res.end(req.params.id)
 })

 如果 id 為 0 則直接進入下一個路由，否則繼續執行下一個堆疊 'res.send('User Info')'
 app.get('/user/:id', function (req, res, next) {
   if (req.params.id == 0) next('route')
   else next()
 }, function (req, res, next) {
   res.send('reqular')
   // next() 此時不需要在呼叫下一個路由
 })
 app.get('/user/:id', function (req, res, next) {
   res.send('special')
 })
 */




