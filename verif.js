const VERIF={
  version:'1.0.0',
  init:()=>{
    let elems=document.querySelectorAll('[data-verif]');
    elems.forEach((item)=>{
      item.addEventListener('blur', (ev)=>{
        VERIF.verif(item);
      });
    });
  },
  verif:(me,endCb)=>{
    endCb = endCb||function(){};
    let rules=me.dataset.verif.split('|');
    let data=me.value;
    let before = me.previousElementSibling;
    let parent = me.parentElement;
    var result=true;
    var resnbr=0;

    if(data=='' && rules.indexOf('required')<0) {
      endCb(true);
      return;
    }

    for(let i=0; i<rules.length ; i++){
      let sep=rules[i].split(':');
      let rule=sep[0];
      let arg=(sep.length>1)?sep[1]:null;

      if(typeof VERIF.RULES[rule]=='undefined'){
        console.error('RULE "{0}" does not exits in VERIF.RULES'.replace(/\{0\}/,rule));
        continue;
      }
      var cbResult=(res)=>{
        if(result){
          resnbr++;
          if(!res){
            result=false;
            if(me.className.indexOf('verif_error')<0)
              me.className+=' verif_error';
            let errtxt=VERIF.RULES[rule].errorText;
            let before_build=document.createElement('div');
            before_build.className='verif_message_error';

            if(before == null) before = parent.insertBefore(before_build,me);
            if(before.className.indexOf('verif_message_error')<0){
              before = parent.insertBefore(before_build,me);
            }
            let errArg=arg;
            if(typeof VERIF.RULES[rule].argToError != 'undefined')
              errArg = VERIF.RULES[rule].argToError(arg);
            before.textContent=errtxt.replace(/\{0\}/,errArg);
          }
        }
        if(result && resnbr==rules.length){
          me.className=me.className.replace('verif_error','')
          if(before != null){
            if(before.className.indexOf('verif_message_error')>=0){
              parent.removeChild(before);
            }
          }
          endCb(result);
        }
      };
      VERIF.RULES[rule].control(cbResult,data,arg);
    }
  },
  verifElems:(elems,after)=>{
    var isOk=true;
    var resnbr=0;
    for(let i=0;i<elems.length;i++){
      var onOneEnd=(res)=>{
        resnbr++;
        if(isOk && !res){
          isOk==false
        }
        if(resnbr==elems.length){
          after(isOk);
        }
      };
      VERIF.verif(elems[i],onOneEnd);
    }
  },
  verifGroup:(groupId,after)=>{
    let elems=document.querySelectorAll('[data-verif-group="{0}"][data-verif]'
                                        .replace(/\{0\}/,groupId));
    VERIF.verifElems(elems,after);
  },
  verifForm:(formName,after)=>{
    let elems=document.querySelectorAll('form[name="{0}"] [data-verif]'
                                        .replace(/\{0\}/,formName));
    VERIF.verifElems(elems,after);
  },
  verifContained:(elemQuery,after)=>{
    let elems=document.querySelectorAll('{0} [data-verif]'
                                        .replace(/\{0\}/,elemQuery));
    VERIF.verifElems(elems,after);
  },
  onClickSubmitAfterVerifGroup:(elem,formName,formGroup)=>{
    elem.addEventListener('click', (e)=>{
      VERIF.verifGroup(formGroup,(isOk)=>{
        if(isOk) document.forms[formName].submit();
      });
    });
  },
  onClickSubmitAfterVerifForm:(elem,formName)=>{
    elem.addEventListener('click', (e)=>{
      VERIF.verifForm(formName,(isOk)=>{
        if(isOk) document.forms[formName].submit();
      });
    });
  },
  addRule:(name,control,errorText,argToError)=>{
    VERIF.RULES[name]={};
    VERIF.RULES[name].control=control;
    VERIF.RULES[name].errorText=errorText;
    if(argToError!='undefined')
      VERIF.RULES[name].argToError=argToError;
  },
  AJAX:(url, callback, method, data)=>{
    method=method||'GET';
    let params = data || null;
    if(params!=null)
      params = typeof data == 'string' ? data : Object.keys(data).map((k) => {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
      }).join('&');

    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open(method, url);
    xhr.onreadystatechange = ()=>{
      if(xhr.readyState > 3)if(xhr.status === 200) {
        callback(xhr.responseText);
      }else{
        console.error('AJAX ERROR -> xhr status : '+xhr.status);
      }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if(params!=null){
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
    }else{
      xhr.send();
    }
    return xhr;
  },
  RULES:{
    required:{
      control:(res,data)=>{res(data.trim().length>0);},
      errorText:'Ce champs est requis'
    },
    alphanumerique:{
      control:(res,data)=>{res(/^\w+$/.test(data.trim()));},
      errorText:'Ce champs dois être alphanumerique sans espace [A-Za-z0-9_]'
    },
    text:{
      control:(res,data)=>{res(/^[\w\ ]+$/.test(data.trim()));},
      errorText:'Ce champs dois être alphanumerique [A-Za-z0-9_ ]'
    },
    int:{
      control:(res,data)=>{res(/^\d+$/.test(data.trim()));},
      errorText:'Ce champs dois être nombre entier'
    },
    double:{
      control:(res,data)=>{res(/^\d+\.?\d*$/.test(data.trim()));},
      errorText:'Ce champs dois être nombre'
    },
    date:{
      control:(res,data)=>{res(/^\d{2}\.\d{2}\.\d{4}$/.test(data.trim()));},
      errorText:'Ce champs dois être une date [jj.mm.aaaa]'
    },
    time:{
      control:(res,data)=>{res(/^\d{2}:\d{2}$/.test(data.trim()));},
      errorText:'Ce champs dois être une heure [HH:MM]'
    },
    date_time:{
      control:(res,data)=>{res(/^\d{2}\.\d{2}\.\d{4}\ \d{2}:\d{2}$/.test(data.trim()));},
      errorText:'Ce champs dois être une date et heure [jj.mm.aaaa HH:MM]'
    },
    max_l:{
      control:(res,data,max)=>{res(data.trim().length<=max);},
      errorText:'Ce champs dois avoir moins de {0} caractères.'
    },
    min_l:{
      control:(res,data,min)=>{res(data.trim().length>=min);},
      errorText:'Ce champs dois avoir plus de {0} caractères.'
    },
    max:{
      control:(res,data,max)=>{res(data.trim()<=max);},
      errorText:'Doit être inférieur ou égale à {0}'
    },
    min:{
      control:(res,data,min)=>{res(data.trim()>=min);},
      errorText:'Doit être supérieur ou égale à {0}'
    },
    email:{
      control:(res,data)=>{res(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                              .test(data.trim()));},
      errorText:'Veuillez entrer un email correcte'
    },
    phone:{
      control:(res,data)=>{
        res(/^(((\+|00)\d{2,3})|0)([./ -]?\d){9}$/
               .test(data.trim()));
      },
      errorText:'Ce champs dois être un numéro de téléphone valide'
    },
    date_past:{
      control:(res,data)=>{
        let ds=data.trim().split('.');
        let now=new Date();
        let date=new Date(ds[2],ds[1],ds[0]);
        res(now.getTime()-date.getTime()>0);
      },
      errorText:'La date doit faire partie du passé'
    },
    date_futur:{
      control:(res,data)=>{
        let ds=data.trim().split('.');
        let now=new Date();
        let date=new Date(ds[2],ds[1],ds[0]);
        res(now.getTime()-date.getTime()<0);
      },
      errorText:'La date doit faire partie du futur'
    },
    date_more_diff:{
      control:(res,data,diff)=>{
        let ds=data.trim().split('.');
        let now=new Date();
        let date=new Date(ds[2],ds[1],ds[0]);
        let ddiff=new Date(Math.abs(now.getTime()-date.getTime()));
        let mdiff=(ddiff.getFullYear()-1970)*12+ddiff.getMonth();
        res(mdiff>=diff);
      },
      errorText:'La date doit avoir une différence d\'au moins {0}',
      argToError:(arg)=>{
        let y = Math.floor(arg/12);
        let m = arg%12;
        return (((y>0)? y+((y==1)?' an':' ans'):'')+((m>0)? ' et ' : '')+((m>0)? m+' mois':''));
      }
    },
    date_less_diff:{
      control:(res,data,diff)=>{
        let ds=data.trim().split('.');
        let now=new Date();
        let date=new Date(ds[2],ds[1],ds[0]);
        let ddiff=new Date(Math.abs(now.getTime()-date.getTime()));
        let mdiff=(ddiff.getFullYear()-1970)*12+ddiff.getMonth();
        res(mdiff<diff);
      },
      errorText:'La date doit avoir une différence inférieure à {0}',
      argToError:(arg)=>{
        let y = Math.floor(arg/12);
        let m = arg%12;
        return (((y>0)? y+((y==1)?' an':' ans'):'')+((m>0)? ' et ' : '')+((m>0)? m+' mois':''));
      }
    },
    ajax:{
      control:(res,data,url)=>{
        VERIF.AJAX(
          url+'?data='+encodeURIComponent(data),
          (cnt)=>{res(JSON.parse(cnt).response);}
        );
      },
      errorText:'La réponse de "{0}" à été négative'
    }
  }
}
window.addEventListener('load', function(e) {
  VERIF.init()
});
