## Middleware 實作 response time

### Middleware function
1. 執行程式碼
2. 變更 request 和 response 
3. 結束 request-response 循環
4. 呼叫堆疊中的下一個 middleware function



### Request-response cycle

1. 客戶端發出請求 Request 

2. middleware 處理請求後 next 轉交給下一個 middleware 

3. midleware 依序完成處理請求

4. 回應 Response

**middleware 是依序執行，所以前後順序很重要**

使用 **next()** 呼叫下一個 middleware
```javascript
app.get('/user/:id', function (req, res, next) {
  console.log('start')
  next()
}, function (req, res, next) {
  consol.log('second')
  // 未使用 next()
})
app.get('/user/:id', function (req, res, next) { // 此路由不會被呼叫
  console.log('end')
})
```
依序印出 start → second

因為 second 後沒有使用 next()，所以 end 不會被呼叫


### Response time ?
直接使用 new Date() 或是 Ｄate.now() 來得知收到請求的當下時間，但無法直接得到伺服器在進行 request-response cycle 時花了多久時間。所以需要找出伺服器在何時完成 response。


```javascript
const middlewareFirst = function (req, res, next) {
  console.log('middleware-first')
  next()
}
const middlewareSecond = function (req, res, next) {
  console.log('middleware-Second')
  next()
}

app.use(middlewareFirst)
app.use(middlewareSecond)

app.get('/', (req, res) => {
  console.log('result')
})
```
收到請求後會依照順序執行
```
middleware-first
middleware-Second
result
```
在 middleware 中加入監聽當回應完成後執行的函式
```
res.on('finish', () => {
    console.log('finsh')
  })
```
而此時卻無法順利取得 'finish'

因為在 '/' 路由中並沒有回應內容，瀏覽器端不會收到回應，只有在伺服器端印出 console，因為沒有回應所以也不會有回應被完成。

試著在 middleware 中加入 res.end 來結束如果沒有回應內容的狀態
```javascript
const middlewareFirst = function (req, res, next) {
  console.log('middleware-first')
  next()
  res.end()
  res.on('finish', () => {
    console.log('finsh')
  })
}
```
順理取得當回應被完成後所要執行的函式內容，並在其中取得時間戳記計算請求道回應完成所需要的時間。

