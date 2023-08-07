# WebStore-2.0 (An updated version of the repository, called the Web)
## 1. backend
  ### Store.Api (web api .net 7)
    1. CRUD category / brand / type / product / payment method.
    2. Order placement.
    3. Adding and removing products from the cart.
    4. Sending an email about successful purchase.
    5. Search category / brand / type / product / payment method.
    6. Sorting categories / brands / types / products / payment methods.
    7. Restore Order Details.
  ### Store.Data (libraries for store.Api)
    1. Models category / brand / type / product / payment method /cart / order.
    2. Const parameters.
  ### UserManagementService (web api .net 7)
    1. Authorisation with JWT-Token.
    2. Refresh-Token to update the JWT-Token.
    3. Management by means of roles.
    4. Private Office.
    5. Sending Registration Confirmation/Password Recovery/Restore User emails.
    6. CRUD user.
## 2. frontend
  ### React JS (js, css)
     1. Uses react-bootstrap / mobx / react-dom / react-router / react-router-dom / react-slick.
     2. Adaptability for any device.
     3. Check JWT token validity on every request.
