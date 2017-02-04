# VerifJS

This script is used to verify field easily. Also works asynchronously.(ex: with ajax on the control)

## Getting stated

1. include the script on the html `<script src="verif.js" ></script>` (before fields that you want to verify)
2. add a `data-verif` attribute to your inputs
```html
<input type="text" data-verif="required|text|min_l:6|max_l:20">
```
3. add some css for the error message
```css
.verif_error{
  border-color: red;
}
.verif_message_error{
  color: red;
}
```

## Rules

- `required` : value != null
- `int` : value is an integer
- `double` : value is a double (or float)
- `text` : value is [a-zA-Z0-9_ ]* with space
- `alphanumerique` : value is [a-zA-Z0-9_]* without space
- `email` : value is an email
- `phone` : value is a phone
- `date` : value is like 'dd.mm.yyyy'
- `time` : value is like 'HH:MM'
- `date_time` : value is like 'dd.mm.yyyy HH:MM'
- `max:<arg>` : value is <= than arg
- `min:<arg>` : value is >= than arg
- `max_l:<arg>` : value.length is <= than arg
- `min_l:<arg>` : value.length is >= than arg
- `date_past` : date is before now
- `date_futur` : date is after now
- `date_more_diff:<arg>` : difference between value and now is more or equal than arg (in month)
- `date_more_diff:<arg>` : difference between value and now is less than arg (in month)

## Add a custom rule

in an other js file, type
```javascript
VERIF.addRule(
  'customRuleName',
  // arg can be null
  (result,data,arg)=>{ result(data.trim()==arg)},
  'A custom error message {0}',
  // not required
  (arg)=>{return arg+' some text'}
);
```
or
```javascript
VERIF.RULES.customRuleName={
  // arg can be null
  control:(result,data,arg)=>{ result(data.trim()==arg)},
  errorText:'A custom error message',
  // not required
  argToError:(arg)=>{return arg+' some text'}
}
```
to use :
```html
                          <!-- arg not required -->
<input type="text" data-verif="customRuleName:arg">
```

## Verify on button click <small>and submit</small>

### For a form

some html :
```html
<form name="myForm" method="post" action="">
  <input type="text" data-verif="required|text|min_l:6|max_l:20">
  <input type="email" data-verif="required|email">
  <input id="btn_verify" type="button">
</form>
```
and some js :
```javascript
let btn=document.getElementById('btn_verify');
VERIF.onClickSubmitAfterVerifForm(btn,'myForm');
```
or
```javascript
document.querySelector('#btn_verify').addEventListener('click', ()=>{
  VERIF.verifForm('myForm',(isOk)=>{
    if(isOk) document.forms["myForm"].submit();
  });
});
```

### For a group

some html :
```html
<form name="myForm" method="post" action="">
  <input type="text" data-verif-group="groupName" data-verif="required|text|min_l:6|max_l:20">
  <input type="email" data-verif-group="groupName" data-verif="required|email">
  <input id="btn_verify" type="button">
</form>
```
and some js :
```javascript
let btn=document.getElementById('btn_verify');
VERIF.onClickSubmitAfterVerifGroup(btn,'myForm','groupName');
```
or
```javascript
document.querySelector('#btn_verify').addEventListener('click', ()=>{
  VERIF.verifGroup('groupName',(isOk)=>{
    if(isOk) document.forms["myForm"].submit();
  });
});
```

## Verify some elements

some html :
```html
<form name="myForm" method="post" action="">
  <input type="text" data-verif-group="groupName" data-verif="required|text|min_l:6|max_l:20">
  <input type="email" data-verif-group="groupName" data-verif="required|email">
  <input id="btn_verify" type="button">
</form>
```
some js for an array of elements :
```javascript
let elems=document.querySelectorAll('form input[data-verif]');
VERIF.verifElems(elems,(isOk)=>{if(isOK) console.log('OK');});
```
some js for a form :
```javascript
VERIF.verifForm('myForm',(isOk)=>{if(isOK) console.log('OK');});
```
some js for a group :
```javascript
VERIF.verifForm('groupName',(isOk)=>{if(isOK) console.log('OK');});
```

## Verify one field

some html :
```html
<input id="myField" type="text" data-verif="required|phone">
```
and some js:
```javascript
VERIF.verif(document.getElementById('myField'),(res)=>{if(res) console.log('OK');});
```
