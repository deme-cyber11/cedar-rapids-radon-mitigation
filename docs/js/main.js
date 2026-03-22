/* === Before/After Slider === */
function initSlider(){
  document.querySelectorAll('.ba-slider').forEach(function(slider){
    var handle=slider.querySelector('.ba-handle');
    var before=slider.querySelector('.ba-before');
    if(!handle||!before)return;
    var dragging=false;
    function move(x){
      var rect=slider.getBoundingClientRect();
      var pos=Math.max(0,Math.min(1,(x-rect.left)/rect.width));
      var pct=pos*100;
      handle.style.left=pct+'%';
      before.style.clipPath='inset(0 '+(100-pct)+'% 0 0)';
    }
    handle.addEventListener('mousedown',function(e){e.preventDefault();dragging=true});
    slider.addEventListener('mousedown',function(e){dragging=true;move(e.clientX)});
    window.addEventListener('mousemove',function(e){if(dragging)move(e.clientX)});
    window.addEventListener('mouseup',function(){dragging=false});
    handle.addEventListener('touchstart',function(e){e.preventDefault();dragging=true},{passive:false});
    slider.addEventListener('touchstart',function(e){dragging=true;move(e.touches[0].clientX)},{passive:true});
    window.addEventListener('touchmove',function(e){if(dragging)move(e.touches[0].clientX)},{passive:true});
    window.addEventListener('touchend',function(){dragging=false});
  });
}

/* === Sticky Header Shadow === */
function initHeader(){
  var header=document.querySelector('.site-header');
  if(!header)return;
  window.addEventListener('scroll',function(){
    if(window.scrollY>10)header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
}

/* === Mobile Nav Toggle === */
function initMobileNav(){
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.querySelector('.main-nav');
  var overlay=document.querySelector('.nav-overlay');
  if(!toggle||!nav)return;
  function close(){nav.classList.remove('open');if(overlay)overlay.classList.remove('open');document.body.style.overflow=''}
  toggle.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    if(overlay)overlay.classList.toggle('open');
    document.body.style.overflow=open?'hidden':'';
  });
  if(overlay)overlay.addEventListener('click',close);
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close)});
}

/* === FAQ Accordion === */
function initFaq(){
  document.querySelectorAll('.faq-question').forEach(function(q){
    q.addEventListener('click',function(){
      var item=q.parentElement;
      var answer=item.querySelector('.faq-answer');
      var inner=answer.querySelector('.faq-answer-inner');
      var isOpen=item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(function(el){
        el.classList.remove('active');
        el.querySelector('.faq-answer').style.maxHeight='0';
      });
      if(!isOpen){
        item.classList.add('active');
        answer.style.maxHeight=inner.scrollHeight+'px';
      }
    });
  });
}

/* === Contact Form (Web3Forms) === */
function initForm(){
  var form=document.querySelector('#contact-form');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var btn=form.querySelector('button[type="submit"]');
    var origText=btn.textContent;
    btn.textContent='Sending...';btn.disabled=true;
    fetch('https://api.web3forms.com/submit',{
      method:'POST',
      body:new FormData(form)
    }).then(function(r){return r.json()}).then(function(d){
      if(d.success)window.location.href='/thank-you/';
      else{btn.textContent='Error — Try Again';btn.disabled=false}
    }).catch(function(){btn.textContent=origText;btn.disabled=false});
  });
}

/* === Init === */
document.addEventListener('DOMContentLoaded',function(){
  initSlider();initHeader();initMobileNav();initFaq();initForm();
});
