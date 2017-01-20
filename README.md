# VerifJS

## Getting stated

1. include the script on the html `<script src="verif.js" ></script>`
2. add a `data-verif` attribute to your inputs
```html
<input type="text" data-verif="required|text|min_l:6|max_l:20">
```
3. add some css for the error message
```css
.verif_error{
  border-bottom: 1px solid #bb3454 !important;
}
.verif_message_error{
  color:#bb3454;
}
```

## Rules

- `required` : value != null
- `int` : value is an integer
- `double` : value is a double (or float)
- `text` : value is [a-zA-Z0-9_ ]* with space
- `alphanumerique` : value is [a-zA-Z0-9_]* without space
- `email` : value is an email
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

in an other js file type
```javascript
VERIF.RULES.customRuleName={
  control:(data)=>{ return (data.trim()=='Custom :D')},
  errorText:'A custom error message'
}
```
to use :
```html
<input type="text" data-verif="customRuleName">
```

## Verify on button click

some html :
```html
<input type="text" data-verif-group="groupName" data-verif="required|text|min_l:6|max_l:20">
<input type="email" data-verif-group="groupName" data-verif="required|email">
<input id="btn_verify" type="button">
```

```javascript
let btn = document.getElementById('btn_verify');
btn.addEventListener('click', ()=>{
  let isOk=VERIF.verifGroup('groupName');
  if(isOK){
    console.log('all inputs are ok');
  }else{
    console.log('Verification ERROR');
    return;
  }
}
```
