(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{215:function(t,e,n){"use strict";n(202);var i=n(203),o=n.n(i),a=n(274),r=n(272),c=n.n(r),s="front_666666";function u(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:500;return function(i){clearTimeout(e),i.persist&&i.persist(),e=setTimeout(function(){t(i)},n)}}function l(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100,i=new Date;return function(o){o.persist&&o.persist(),clearTimeout(e);var a=new Date;a-i<=n?e=setTimeout(function(){t(o)},n):(i=a,t(o))}}function h(t,e){return Math.floor(Math.random()*(e-t)+t)}function d(t){return c.a.AES.encrypt(JSON.stringify(t),s).toString()}function v(t){var e={};if(function(t){return"[object Object]"===Object.prototype.toString.call(t)}(t))for(var n=0,i=Object.entries(t);n<i.length;n++){var r=i[n],c=Object(a.a)(r,2),s=c[0],u=c[1];e[s]=o.a.createFormField({value:u})}return e}n.d(e,"b",function(){return u}),n.d(e,"e",function(){return l}),n.d(e,"d",function(){return h}),n.d(e,"c",function(){return d}),n.d(e,"a",function(){return v})},842:function(t,e,n){"use strict";n.r(e);var i=n(208),o=n(34),a=n(35),r=n(38),c=n(36),s=n(82),u=n(37),l=n(0),h=n.n(l),d=n(402),v=n(857),f=n(215),g=n(83),m=function(t){function e(t){var n;return Object(o.a)(this,e),(n=Object(r.a)(this,Object(c.a)(e).call(this,t))).loadImageAsync=function(t){return new Promise(function(e,n){var i=new Image;i.onload=function(){e(t)},i.onerror=function(){console.log("\u56fe\u7247\u8f7d\u5165\u9519\u8bef")},i.src=t})},n.handleMouseMove=function(t){var e=0,i=0;t.pageX||t.pageY?(e=t.pageX,i=t.pageY):(t.clientX||t.clientY)&&(e=t.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,i=t.clientY+document.body.scrollTop+document.documentElement.scrollTop),n.target.x=e,n.target.y=i},n.start=function(){var t=Object(s.a)(n),e=t.width,i=t.height,o=t.points,a=t.ctx,r=t.target;a.clearRect(0,0,e,i);var c=!0,u=!1,l=void 0;try{for(var h,d=o[Symbol.iterator]();!(c=(h=d.next()).done);c=!0){var v=h.value;Math.abs(n._getDistance(r,v))<4e3?(v.lineActive=.3,v.pointActive=.6):Math.abs(n._getDistance(r,v))<2e4?(v.lineActive=.1,v.pointActive=.3):Math.abs(n._getDistance(r,v))<4e4?(v.lineActive=.02,v.pointActive=.1):(v.lineActive=0,v.pointActive=0),n._drawLines(v,a),n._drawPoint(v,a)}}catch(f){u=!0,l=f}finally{try{c||null==d.return||d.return()}finally{if(u)throw l}}n.myReq=window.requestAnimationFrame(function(){return n.start()})},n.initPage=function(){n.ctx=n.canvas.getContext("2d"),n._createPoints(),n.start(),window.onmousemove=Object(f.e)(n.handleMouseMove,50)},n.destory=function(){window.cancelAnimationFrame(n.myReq),window.onmousemove=null},n.points=[],n.width=window.innerWidth,n.height=window.innerHeight,n.canvas=null,n.ctx=null,n.target={},n.state={loading:!1},n}return Object(u.a)(e,t),Object(a.a)(e,[{key:"componentDidMount",value:function(){var t=this;this.setState({loading:!0}),this.loadImageAsync(this.props.url).then(function(){t.setState({loading:!1})}).then(function(){t.canvas&&t.initPage()})}},{key:"componentWillUnmount",value:function(){this.destory()}},{key:"_createPoints",value:function(){for(var t=this.width,e=this.height,n=0;n<t;n+=t/20)for(var i=0;i<e;i+=e/20){var o=n+Math.random()*t/20,a=i+Math.random()*e/20,r={x:o,originX:o,y:a,originY:a};this.points.push(r)}for(var c=0;c<this.points.length;c++){for(var s=[],u=this.points[c],l=c+1;l<this.points.length;l++){for(var h=this.points[l],d=!1,v=0;v<5;v++)d||void 0===s[v]&&(s[v]=h,d=!0);for(var f=0;f<5;f++)d||this._getDistance(u,h)<this._getDistance(u,s[f])&&(s[f]=h,d=!0)}u.closest=s,u.radius=2+2*Math.random(),this._shakePoint(u)}}},{key:"_shakePoint",value:function(t){var e=this;d.c.to(t,1+1*Math.random(),{x:t.originX-50+100*Math.random(),y:t.originY-50+100*Math.random(),ease:v.a.easeInOut,onComplete:function(){e._shakePoint(t)}})}},{key:"_drawPoint",value:function(t,e){t.pointActive&&(e.beginPath(),e.arc(t.x,t.y,t.radius,0,2*Math.PI,!1),e.fillStyle="rgba(156,217,249,"+t.pointActive+")",e.fill())}},{key:"_drawLines",value:function(t,e){if(t.lineActive){var n=!0,i=!1,o=void 0;try{for(var a,r=t.closest[Symbol.iterator]();!(n=(a=r.next()).done);n=!0){var c=a.value;e.beginPath(),e.moveTo(t.x,t.y),e.lineTo(c.x,c.y),e.strokeStyle="rgba(156,217,249,"+t.lineActive+")",e.stroke()}}catch(s){i=!0,o=s}finally{try{n||null==r.return||r.return()}finally{if(i)throw o}}}}},{key:"_getDistance",value:function(t,e){return Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)}},{key:"render",value:function(){var t=this,e=this.props.url,n=this.state.loading;return h.a.createElement("div",null,n?h.a.createElement("div",{style:p.backgroundBox},h.a.createElement(g.a,null)):h.a.createElement("div",{style:Object(i.a)({},p.backgroundBox,{backgroundImage:"url(".concat(e,")")})},h.a.createElement("canvas",{ref:function(e){return t.canvas=e},style:p.canvasStyle,width:this.width,height:this.height}),this.props.children))}}]),e}(h.a.Component);m.defaultProps={url:"https://github.com/zhangZhiHao1996/image-store/blob/master/react-admin-master/bg1.jpg?raw=true"};var p={backgroundBox:{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",backgroundSize:"100% 100%"},canvasStyle:{display:"block",position:"fixed",top:"0",left:"0"}};e.default=m}}]);