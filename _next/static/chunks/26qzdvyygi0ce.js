(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,74503,e=>{"use strict";var t=e.i(43476);e.s(["FadeIn",0,function({children:e,className:r=""}){return(0,t.jsx)("div",{className:r,children:e})}])},83920,e=>{"use strict";e.s(["progress",0,(e,t,r)=>{let a=t-e;return a?(r-e)/a:1}])},38638,3163,e=>{"use strict";let t=(...e)=>e.reduce((e,t)=>r=>t(e(r)));e.s(["pipe",0,t],38638);var r=e.i(65566),a=e.i(19928),n=e.i(79444),i=e.i(69577),o=e.i(63011),s=e.i(22660);function l(e,t,r){return(r<0&&(r+=1),r>1&&(r-=1),r<1/6)?e+(t-e)*6*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}var c=e.i(66820);function d(e,t){return r=>r>0?t:e}var u=e.i(706);let h=(e,t,r)=>{let a=e*e,n=r*(t*t-a)+a;return n<0?0:Math.sqrt(n)},p=[o.hex,c.rgba,s.hsla];function g(e){let t=p.find(t=>t.test(e));if((0,r.warning)(!!t,`'${e}' is not an animatable color. Use the equivalent color code instead.`,"color-not-animatable"),!t)return!1;let a=t.parse(e);return t===s.hsla&&(a=function({hue:e,saturation:t,lightness:r,alpha:a}){e/=360,r/=100;let n=0,i=0,o=0;if(t/=100){let a=r<.5?r*(1+t):r+t-r*t,s=2*r-a;n=l(s,a,e+1/3),i=l(s,a,e),o=l(s,a,e-1/3)}else n=i=o=r;return{red:Math.round(255*n),green:Math.round(255*i),blue:Math.round(255*o),alpha:a}}(a)),a}let f=(e,t)=>{let r=g(e),a=g(t);if(!r||!a)return d(e,t);let n={...r};return e=>(n.red=h(r.red,a.red,e),n.green=h(r.green,a.green,e),n.blue=h(r.blue,a.blue,e),n.alpha=(0,u.mixNumber)(r.alpha,a.alpha,e),c.rgba.transform(n))},m=new Set(["none","hidden"]);function b(e,t){return r=>(0,u.mixNumber)(e,t,r)}function y(e){return"number"==typeof e?b:"string"==typeof e?(0,a.isCSSVariableToken)(e)?d:n.color.test(e)?f:k:Array.isArray(e)?v:"object"==typeof e?n.color.test(e)?f:w:d}function v(e,t){let r=[...e],a=r.length,n=e.map((e,r)=>y(e)(e,t[r]));return e=>{for(let t=0;t<a;t++)r[t]=n[t](e);return r}}function w(e,t){let r={...e,...t},a={};for(let n in r)void 0!==e[n]&&void 0!==t[n]&&(a[n]=y(e[n])(e[n],t[n]));return e=>{for(let t in a)r[t]=a[t](e);return r}}let k=(e,a)=>{let n=i.complex.createTransformer(a),o=(0,i.analyseComplexValue)(e),s=(0,i.analyseComplexValue)(a);if(!(o.indexes.var.length===s.indexes.var.length&&o.indexes.color.length===s.indexes.color.length&&o.indexes.number.length>=s.indexes.number.length))return(0,r.warning)(!0,`Complex values '${e}' and '${a}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`,"complex-values-different"),d(e,a);if(m.has(e)&&!s.values.length||m.has(a)&&!o.values.length)return m.has(e)?t=>t<=0?e:a:t=>t>=1?a:e;return t(v(function(e,t){let r=[],a={color:0,var:0,number:0};for(let n=0;n<t.values.length;n++){let i=t.types[n],o=e.indexes[i][a[i]],s=e.values[o]??0;r[n]=s,a[i]++}return r}(o,s),s.values),n)};e.s(["mix",0,function(e,t,r){return"number"==typeof e&&"number"==typeof t&&"number"==typeof r?(0,u.mixNumber)(e,t,r):y(e)(e,t)}],3163)},44230,15923,e=>{"use strict";var t=e.i(65566),r=e.i(76959),a=e.i(59176),n=e.i(60830),i=e.i(38638),o=e.i(83920),s=e.i(3163);e.s(["interpolate",0,function(e,l,{clamp:c=!0,ease:d,mixer:u}={}){let h=e.length;if((0,t.invariant)(h===l.length,"Both input and output ranges must be the same length","range-length"),1===h)return()=>l[0];if(2===h&&l[0]===l[1])return()=>l[1];let p=e[0]===e[1];e[0]>e[h-1]&&(e=[...e].reverse(),l=[...l].reverse());let g=function(e,t,r){let o=[],l=r||a.MotionGlobalConfig.mix||s.mix,c=e.length-1;for(let r=0;r<c;r++){let a=l(e[r],e[r+1]);if(t){let e=Array.isArray(t)?t[r]||n.noop:t;a=(0,i.pipe)(e,a)}o.push(a)}return o}(l,d,u),f=g.length,m=t=>{if(p&&t<e[0])return l[0];let r=0;if(f>1)for(;r<e.length-2&&!(t<e[r+1]);r++);let a=(0,o.progress)(e[r],e[r+1],t);return g[r](a)};return c?t=>m((0,r.clamp)(e[0],e[h-1],t)):m}],44230);var l=e.i(706);e.s(["defaultOffset",0,function(e){let t=[0];return!function(e,t){let r=e[e.length-1];for(let a=1;a<=t;a++){let n=(0,o.progress)(0,t,a);e.push((0,l.mixNumber)(r,1,n))}}(t,e.length-1),t}],15923)},58866,e=>{"use strict";var t=e.i(44230);e.s(["transform",0,function(...e){let r=!Array.isArray(e[0]),a=r?0:-1,n=e[0+a],i=e[1+a],o=e[2+a],s=e[3+a],l=(0,t.interpolate)(i,o,s);return r?l(n):l}])},87652,e=>{"use strict";var t=e.i(86427),r=e.i(71645),a=e.i(13383),n=e.i(47414);e.s(["useMotionValue",0,function(e){let i=(0,n.useConstant)(()=>(0,t.motionValue)(e)),{isStatic:o}=(0,r.useContext)(a.MotionConfigContext);if(o){let[,t]=(0,r.useState)(e);(0,r.useEffect)(()=>i.on("change",t),[])}return i}])},95420,e=>{"use strict";var t=e.i(58866),r=e.i(47414),a=e.i(87022),n=e.i(74008),i=e.i(87652);function o(e,t){let r=(0,i.useMotionValue)(t()),o=()=>r.set(t());return o(),(0,n.useIsomorphicLayoutEffect)(()=>{let t=()=>a.frame.preRender(o,!1,!0),r=e.map(e=>e.on("change",t));return()=>{r.forEach(e=>e()),(0,a.cancelFrame)(o)}}),r}var s=e.i(86427);function l(e,t){let a=(0,r.useConstant)(()=>[]);return o(e,()=>{a.length=0;let r=e.length;for(let t=0;t<r;t++)a[t]=e[t].get();return t(a)})}e.s(["useTransform",0,function e(a,n,i,c){if("function"==typeof a){let e;return s.collectMotionValues.current=[],a(),e=o(s.collectMotionValues.current,a),s.collectMotionValues.current=void 0,e}if(void 0!==i&&!Array.isArray(i)&&"function"!=typeof n){var d=a,u=n,h=i,p=c;let t=(0,r.useConstant)(()=>Object.keys(h)),o=(0,r.useConstant)(()=>({}));for(let r of t)o[r]=e(d,u,h[r],p);return o}let g="function"==typeof n?n:(0,t.transform)(n,i,c),f=Array.isArray(a)?l(a,g):l([a],([e])=>g(e)),m=Array.isArray(a)?void 0:a.accelerate;return m&&!m.isTransformed&&"function"!=typeof n&&Array.isArray(i)&&c?.clamp!==!1&&(f.accelerate={...m,times:n,keyframes:i,isTransformed:!0,...c?.ease?{ease:c.ease}:{}}),f}],95420)},61327,89026,49652,e=>{"use strict";let t,r;var a=e.i(42824);function n(e){return(0,a.isObject)(e)&&"ownerSVGElement"in e}function i(e,t,r){if(null==e)return[];if(e instanceof EventTarget)return[e];if("string"==typeof e){let a=document;t&&(a=t.current);let n=r?.[e]??a.querySelectorAll(e);return n?Array.from(n):[]}return Array.from(e).filter(e=>null!=e)}e.s(["isSVGElement",0,n],89026),e.s(["resolveElements",0,i],49652);let o=new WeakMap,s=(e,t,r)=>(a,i)=>i&&i[0]?i[0][e+"Size"]:n(a)&&"getBBox"in a?a.getBBox()[t]:a[r],l=s("inline","width","offsetWidth"),c=s("block","height","offsetHeight");function d({target:e,borderBoxSize:t}){o.get(e)?.forEach(r=>{r(e,{get width(){return l(e,t)},get height(){return c(e,t)}})})}function u(e){e.forEach(d)}let h=new Set;e.s(["resize",0,function(e,a){let n;return"function"==typeof e?(h.add(e),r||(r=()=>{let e={get width(){return window.innerWidth},get height(){return window.innerHeight}};h.forEach(t=>t(e))},window.addEventListener("resize",r)),()=>{h.delete(e),h.size||"function"!=typeof r||(window.removeEventListener("resize",r),r=void 0)}):(!t&&"u">typeof ResizeObserver&&(t=new ResizeObserver(u)),(n=i(e)).forEach(e=>{let r=o.get(e);r||(r=new Set,o.set(e,r)),r.add(a),t?.observe(e)}),()=>{n.forEach(e=>{let r=o.get(e);r?.delete(a),r?.size||t?.unobserve(e)})})}],61327)},2544,e=>{e.v({copy:"PageHeader-module__cS7uea__copy",header:"PageHeader-module__cS7uea__header"})},22706,e=>{"use strict";var t=e.i(43476),r=e.i(24511),a=e.i(60140),n=e.i(30551),i=e.i(86427),o=e.i(65566),s=e.i(71645),l=e.i(60830),c=e.i(87022);function d(e,t){let r,a=()=>{let{currentTime:a}=t,n=(null===a?0:a.value)/100;r!==n&&e(n),r=n};return c.frame.preUpdate(a,!0),()=>(0,c.cancelFrame)(a)}function u(e){return!("u"<typeof window)&&(e?(0,n.supportsViewTimeline)():(0,n.supportsScrollTimeline)())}var h=e.i(61327),p=e.i(83920),g=e.i(25791);let f=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),m={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}};function b(e,t,r,a){let n=r[t],{length:i,position:o}=m[t],s=n.current,l=r.time;n.current=Math.abs(e[`scroll${o}`]),n.scrollLength=e[`scroll${i}`]-e[`client${i}`],n.offset.length=0,n.offset[0]=0,n.offset[1]=n.scrollLength,n.progress=(0,p.progress)(0,n.scrollLength,n.current);let c=a-l;n.velocity=c>50?0:(0,g.velocityPerSecond)(n.current-s,c)}e.i(47167);var y=e.i(44230),v=e.i(15923),w=e.i(76959),k=e.i(72846);let x={start:0,center:.5,end:1};function S(e,t,r=0){let a=0;if(e in x&&(e=x[e]),"string"==typeof e){let t=parseFloat(e);e.endsWith("px")?a=t:e.endsWith("%")?e=t/100:e.endsWith("vw")?a=t/100*document.documentElement.clientWidth:e.endsWith("vh")?a=t/100*document.documentElement.clientHeight:e=t}return"number"==typeof e&&(a=t*e),r+a}let P=[0,0],C=[[0,0],[1,1]],T={x:0,y:0},A=new WeakMap,_=new WeakMap,M=new WeakMap,E=new WeakMap,O=new WeakMap,L=e=>e===document.scrollingElement?window:e;function I(e,{container:t=document.scrollingElement,trackContentSize:r=!1,...a}={}){if(!t)return l.noop;let n=M.get(t);n||(n=new Set,M.set(t,n));let i=function(e,t,r,a={}){return{measure:t=>{!function(e,t=e,r){if(r.x.targetOffset=0,r.y.targetOffset=0,t!==e){let a=t;for(;a&&a!==e;)r.x.targetOffset+=a.offsetLeft,r.y.targetOffset+=a.offsetTop,a=a.offsetParent}r.x.targetLength=t===e?t.scrollWidth:t.clientWidth,r.y.targetLength=t===e?t.scrollHeight:t.clientHeight,r.x.containerLength=e.clientWidth,r.y.containerLength=e.clientHeight}(e,a.target,r),b(e,"x",r,t),b(e,"y",r,t),r.time=t,(a.offset||a.target)&&function(e,t,r){let{offset:a=C}=r,{target:n=e,axis:i="y"}=r,o="y"===i?"height":"width",s=n!==e?function(e,t){let r={x:0,y:0},a=e;for(;a&&a!==t;)if((0,k.isHTMLElement)(a))r.x+=a.offsetLeft,r.y+=a.offsetTop,a=a.offsetParent;else if("svg"===a.tagName){let e=a.getBoundingClientRect(),t=(a=a.parentElement).getBoundingClientRect();r.x+=e.left-t.left,r.y+=e.top-t.top}else if(a instanceof SVGGraphicsElement){let{x:e,y:t}=a.getBBox();r.x+=e,r.y+=t;let n=null,i=a.parentNode;for(;!n;)"svg"===i.tagName&&(n=i),i=a.parentNode;a=n}else break;return r}(n,e):T,l=n===e?{width:e.scrollWidth,height:e.scrollHeight}:"getBBox"in n&&"svg"!==n.tagName?n.getBBox():{width:n.clientWidth,height:n.clientHeight},c={width:e.clientWidth,height:e.clientHeight};t[i].offset.length=0;let d=!t[i].interpolate,u=a.length;for(let e=0;e<u;e++){let r=function(e,t,r,a){let n=Array.isArray(e)?e:P,i=0;return"number"==typeof e?n=[e,e]:"string"==typeof e&&(n=(e=e.trim()).includes(" ")?e.split(" "):[e,x[e]?e:"0"]),(i=S(n[0],r,a))-S(n[1],t)}(a[e],c[o],l[o],s[i]);d||r===t[i].interpolatorOffsets[e]||(d=!0),t[i].offset[e]=r}d&&(t[i].interpolate=(0,y.interpolate)(t[i].offset,(0,v.defaultOffset)(a),{clamp:!1}),t[i].interpolatorOffsets=[...t[i].offset]),t[i].progress=(0,w.clamp)(0,1,t[i].interpolate(t[i].current))}(e,r,a)},notify:()=>t(r)}}(t,e,{time:0,x:f(),y:f()},a);if(n.add(i),!A.has(t)){let e=()=>{for(let e of n)e.measure(c.frameData.timestamp);c.frame.preUpdate(r)},r=()=>{for(let e of n)e.notify()},a=()=>c.frame.read(e);A.set(t,a);let i=L(t);window.addEventListener("resize",a),t!==document.documentElement&&_.set(t,(0,h.resize)(t,a)),i.addEventListener("scroll",a),a()}if(r&&!O.has(t)){let e=A.get(t),r={width:t.scrollWidth,height:t.scrollHeight};E.set(t,r);let a=c.frame.read(()=>{let a=t.scrollWidth,n=t.scrollHeight;(r.width!==a||r.height!==n)&&(e(),r.width=a,r.height=n)},!0);O.set(t,a)}let o=A.get(t);return c.frame.read(o,!1,!0),()=>{(0,c.cancelFrame)(o);let e=M.get(t);if(!e||(e.delete(i),e.size))return;let r=A.get(t);A.delete(t),r&&(L(t).removeEventListener("scroll",r),_.get(t)?.(),window.removeEventListener("resize",r));let a=O.get(t);a&&((0,c.cancelFrame)(a),O.delete(t)),E.delete(t)}}let N=[[[[0,1],[1,1]],"entry"],[[[0,0],[1,0]],"exit"],[[[1,0],[0,1]],"cover"],[C,"contain"]],H={start:0,end:1};function R(e){if(!e)return{rangeStart:"contain 0%",rangeEnd:"contain 100%"};for(let[t,r]of N)if(function(e,t){let r=function(e){if(2!==e.length)return;let t=[];for(let r of e)if(Array.isArray(r))t.push(r);else{if("string"!=typeof r)return;let e=function(e){let t=e.trim().split(/\s+/);if(2!==t.length)return;let r=H[t[0]],a=H[t[1]];if(void 0!==r&&void 0!==a)return[r,a]}(r);if(!e)return;t.push(e)}return t}(e);if(!r)return!1;for(let e=0;e<2;e++){let a=r[e],n=t[e];if(a[0]!==n[0]||a[1]!==n[1])return!1}return!0}(e,t))return{rangeStart:`${r} 0%`,rangeEnd:`${r} 100%`}}let j=new Map;function D(e){let t={value:0},r=I(r=>{t.value=100*r[e.axis].progress},e);return{currentTime:t,cancel:r}}function W({source:e,container:t,...r}){let{axis:a}=r;e&&(t=e);let n=j.get(t);n||(n=new Map,j.set(t,n));let i=r.target??"self",o=n.get(i);o||(o={},n.set(i,o));let s=a+(r.offset??[]).join(",");return o[s]||(r.target&&u(r.target)?R(r.offset)?o[s]=new ViewTimeline({subject:r.target,axis:a}):o[s]=D({container:t,...r}):u()?o[s]=new ScrollTimeline({source:t,axis:a}):o[s]=D({container:t,...r})),o[s]}function q(e,{axis:t="y",container:r=document.scrollingElement,...a}={}){let n,i,o;if(!r)return l.noop;let s={axis:t,container:r,...a};return"function"==typeof e?function(e,t){return 2===e.length||t&&(t.target||t.offset)?I(r=>{e(r[t.axis].progress,r)},t):d(e,W(t))}(e,s):(n=W(s),i=s.target?R(s.offset):void 0,o=s.target?u(s.target)&&!!i:u(),e.attachTimeline({timeline:o?n:void 0,...i&&o&&{rangeStart:i.rangeStart,rangeEnd:i.rangeEnd},observe:e=>(e.pause(),d(t=>{e.time=e.iterationDuration*t},n))}))}var F=e.i(47414),V=e.i(74008);let G=()=>({scrollX:(0,i.motionValue)(0),scrollY:(0,i.motionValue)(0),scrollXProgress:(0,i.motionValue)(0),scrollYProgress:(0,i.motionValue)(0)}),U=e=>!!e&&!e.current;function X(e,t,r,n){return{factory:i=>{let o,s=()=>{U(r)||U(n)?a.microtask.read(s):o=q(i,{...t,axis:e,container:r?.current||void 0,target:n?.current||void 0})};return a.microtask.read(s),()=>{(0,a.cancelMicrotask)(s),o?.()}},times:[0,1],keyframes:[0,1],ease:e=>e,duration:1}}var z=e.i(95420),B=e.i(2544);e.s(["PageHeader",0,function({title:e,description:i}){let l=(0,s.useRef)(null),{scrollYProgress:c}=function({container:e,target:t,...r}={}){var i;let l=(0,F.useConstant)(G);i=r.offset,!("u"<typeof window)&&(t?(0,n.supportsViewTimeline)()&&!!R(i):(0,n.supportsScrollTimeline)())&&(l.scrollXProgress.accelerate=X("x",r,e,t),l.scrollYProgress.accelerate=X("y",r,e,t));let c=(0,s.useRef)(null),d=(0,s.useRef)(!1),u=(0,s.useCallback)(()=>(c.current=q((e,{x:t,y:r})=>{l.scrollX.set(t.current),l.scrollXProgress.set(t.progress),l.scrollY.set(r.current),l.scrollYProgress.set(r.progress)},{...r,container:e?.current||void 0,target:t?.current||void 0}),()=>{c.current?.()}),[e,t,JSON.stringify(r.offset)]);return(0,V.useIsomorphicLayoutEffect)(()=>{if(d.current=!1,!(U(e)||U(t)))return u();d.current=!0},[u]),(0,s.useEffect)(()=>{let r;if(!d.current)return;let n=()=>{let a=U(e),n=U(t);(0,o.invariant)(!a,"Container ref is defined but not hydrated","use-scroll-ref"),(0,o.invariant)(!n,"Target ref is defined but not hydrated","use-scroll-ref"),a||n||(r=u())};return a.microtask.read(n),()=>{(0,a.cancelMicrotask)(n),r?.()}},[u]),l}({target:l,offset:["start start","end start"]}),d=(0,z.useTransform)(c,[0,1],[0,-20]);return(0,t.jsx)("header",{className:`page-header container ${B.default.header}`,ref:l,children:(0,t.jsxs)(r.m.div,{className:B.default.copy,style:{y:d},children:[(0,t.jsx)("h1",{children:e}),(0,t.jsx)("p",{children:i})]})})}],22706)},72520,e=>{"use strict";let t=(0,e.i(75254).default)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);e.s(["ArrowRight",0,t],72520)},78583,e=>{"use strict";let t=(0,e.i(75254).default)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],78583)},87316,e=>{"use strict";let t=(0,e.i(75254).default)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["Calendar",0,t],87316)},53737,e=>{e.v({card:"blog-module__JsT-Oq__card",cardHead:"blog-module__JsT-Oq__cardHead",cta:"blog-module__JsT-Oq__cta",empty:"blog-module__JsT-Oq__empty",excerpt:"blog-module__JsT-Oq__excerpt",filterActive:"blog-module__JsT-Oq__filterActive",filterChip:"blog-module__JsT-Oq__filterChip",filters:"blog-module__JsT-Oq__filters",grid:"blog-module__JsT-Oq__grid",icon:"blog-module__JsT-Oq__icon",listWrap:"blog-module__JsT-Oq__listWrap",meta:"blog-module__JsT-Oq__meta",page:"blog-module__JsT-Oq__page",rssLink:"blog-module__JsT-Oq__rssLink",tag:"blog-module__JsT-Oq__tag",tags:"blog-module__JsT-Oq__tags",toolbar:"blog-module__JsT-Oq__toolbar"})},46583,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(22016),n=e.i(72520),i=e.i(87316),o=e.i(78583),s=e.i(74503);let l=[{slug:"free-visitor-analytics-and-blog-ux",title:"Free visitor analytics on GitHub Pages — and a sharper blog UX",excerpt:"Restore /status for visit counts, country/region maps, and localStorage-first analytics without a paid API — plus blog tag filters, TOC, and related posts.",date:"2026-09-17",tags:["Analytics","GitHub Pages","Blog","UX","Privacy"],content:`
The portfolio already tracked visits in the browser. The missing piece was making that dashboard reachable again — and making sure SPA navigations count as real page views.

## What “free” means here

- **Visit log** — country, region, city (approximate), device, browser, OS, and page path in \`localStorage\`
- **Geo** — free providers (ipwho.is → ipapi.co → geojs.io), no API key
- **Optional** — Supabase sync and CountAPI totals only when build-time env is set
- **No cookies / no accounts** for the core path

## Multi-page tracking

Previously a session flag recorded only the **first** page in a tab. That hid funnels like Home → Work → Blog. Tracking now uses a **30-minute per-page dedup** so each route can count once without double-writing on React remounts.

## Blog UX

The blog index now filters by tag. Post pages add a table of contents, previous/next navigation, and related posts by shared tags — all static, no backend.

Open **[/status/](/status/)** to see the visitor map and **[/blog/](/blog/)** for the new filters.
`},{slug:"enhancement-phases-a-through-e",title:"Phases A–E + cross-browser hardening: analytics, CI, and Safari/mobile support",excerpt:"A full pass across debt clearance, visitor geo inference, Supabase backfill, and test coverage — followed by six cross-browser phases: backdrop-filter fallbacks, multi-browser CI, WebGL/low-memory gating, PWA install, and browser analytics.",date:"2026-07-09",tags:["Analytics","CI/CD","Supabase","Next.js","Cross-browser","Safari"],ogImage:"/og/blog-enhancement-phases.svg",content:'\nAfter the geo lookup and resume icon fixes, I ran a **five-phase enhancement plan** (A through E) across the whole portfolio codebase — not just bug fixes, but accuracy, reliability, content, and test coverage.\n\n## Phase A — quick wins\n\n- **Resume cache bust** — `RESUME_VERSION` bumped; `generate_resume.py` now auto-patches it from the last git commit date of `resume.html`.\n- **Deprecated API removed** — `suggestedPrompts` dropped from `chat-knowledge.ts`; use `suggestedPromptPool` + `pickSuggestedPrompts()`.\n- **README synced** — `ci.yml`, blog routes, and branch protection docs updated.\n- **Gallery self-hosted** — Unsplash CDN URLs replaced with local SVG tiles under `public/gallery/`.\n\n## Phase B — analytics accuracy\n\n- **Multi-provider geo** — ipwho.is → ipapi.co → geojs.io fallback (from the prior geo PR).\n- **Geo inference** — sibling visits and current-session geo backfill `XX` rows in localStorage.\n- **Supabase backfill** — new SQL migration (`allow-geo-backfill-update.sql`) lets the client PATCH unresolved rows when inference succeeds.\n- **Stale cleanup** — `cleanup-unresolved-visits.sql` purges `XX` rows older than 30 days (manual or pg_cron).\n- **Visit deduplication** — same page within 30 minutes no longer double-counts.\n- **Explicit demo mode** — `NEXT_PUBLIC_DEMO_ANALYTICS=true/false` overrides localhost defaults.\n- **85+ country centroids** — map pins for most real visitor countries.\n\n## Phase C — reliability\n\n- **PR-only CI** — `ci.yml` runs on pull requests; merge triggers **deploy only** (build + gh-pages), not a second full CI suite.\n- **Lighthouse** — `numberOfRuns: 3` for stabler medians; perf floor 0.72 warn.\n- **Service worker** — cache version bumped; HTML stays network-first so deploys are picked up immediately.\n- **3D scene deferral** — React Three Fiber loads after scroll, pointer, or keydown — not on idle — so it does not compete with LCP.\n- **Status health** — LinkedIn/GitHub profile probes are informational only; they no longer mark the site `degraded`.\n\n## Phase D — content depth\n\n- **Chat paraphrase matching** — synonym expansion + bigram similarity so "what technologies does he use?" maps to the tech stack entry.\n- **Case study depth** — expanded write-ups for `estimate-calculator` and `php-3rdpartycomms`.\n- **Per-post OG images** — blog posts and case studies can set a custom `ogImage` for social cards.\n\n## Phase E — tests\n\n- `visitor-analytics.test.ts` — `formatVisitGeo`, `shouldUseDemoAnalytics`\n- `status-check.test.ts` — informational probe exclusion\n- E2E — status map + chat response smoke tests\n- Resume HTML regression — contact icon size attributes\n\n## Supabase migration order\n\nRun in SQL Editor, once each:\n\n1. `visits.sql`\n2. `harden-visits-rls.sql`\n3. `allow-geo-backfill-update.sql`\n4. `cleanup-unresolved-visits.sql` (manual or scheduled)\n\nThe static client never needs server-side code — RLS policies bound what the publishable key can do.\n\n---\n\n# Cross-browser hardening (phases 1–6)\n\nAfter A–E merged, real-world usage exposed how much of the experience was quietly Chrome-first. Global share is roughly **65–70% Chrome, 15–18% Safari** (higher on mobile/tablet), **~5% Edge**, and **~2–3% Firefox** — so Safari and mobile were the biggest gaps. A follow-up ran six focused phases.\n\n## Phase 1 — Safari & touch compatibility\n\n- **Blur fallbacks everywhere** — a shared `touch-blur-fallback.css` plus `@supports not (backdrop-filter)` and `(hover: none)/(pointer: coarse)` guards were added to every glass surface (ContactDock, ChatWindow, SystemMetrics, GalleryGrid, AnalysisOverlay, ThemedSelect, Contact, Education, VisitorMonitor).\n- **Navbar cascade fix** — the mobile `.links` menu no longer re-applied `backdrop-filter` on top of the touch fallback.\n- **Honest telemetry labels** — `SystemMetrics` shows *"Chrome only" / "Not in this browser"* for JS heap, network, and `deviceMemory` instead of pretending Safari/Firefox report them, via a new `browser-capabilities.ts`.\n\n## Phase 2 — multi-browser CI\n\n- **Playwright matrix** — smoke tests now run on Desktop Chrome, **Firefox**, **Mobile Chrome (Pixel 5)**, and **Mobile Safari (iPhone 13/WebKit)**.\n- **Mobile Lighthouse** — a second `lighthouserc.mobile.json` config + `lighthouse-mobile` CI job catches mobile-only perf regressions.\n\n## Phase 3 — viewport & WebGL\n\n- **Safe-area / dynamic viewport** — `100dvh` and `-webkit-fill-available` audited across Hero and the 404 page so iOS Safari\'s collapsing chrome doesn\'t clip content.\n- **WebGL probe** — the 3D scene is gated behind an actual WebGL capability check, not just a preference flag.\n- **UA test coverage** — `device-parse` now recognizes Edge, Samsung Internet, and in-app browsers (LinkedIn/Facebook/Instagram), with tests to match.\n\n## Phase 4 — mobile performance\n\n- **Low-memory gating** — `isLowMemoryDevice()` (`deviceMemory` / `hardwareConcurrency`) disables the 3D scene and cuts particle counts, DPR, and antialiasing on constrained devices.\n- **Decorative-layer skip** — `BackgroundFX` drops aurora/orbs/scanlines on reduced-effect and touch-first devices.\n\n## Phase 5 — modern navigation & PWA\n\n- **View Transitions** — cross-document navigation fades via `@view-transition`, a graceful no-op on unsupported browsers.\n- **Route prefetch off** — navbar links keep `prefetch={false}` on this static export so Next.js does not eagerly preload other routes\' CSS chunks on the homepage (avoids Chrome "preloaded but not used" warnings and wasted bandwidth).\n- **Install hint** — a dismissible, `standalone`-aware `PwaInstallHint` surfaces the native install prompt.\n\n## Phase 6 — browser analytics on /status\n\n- **Browser breakdown** — `visitor-analytics` aggregates a normalized `BrowserStat` (Chrome family / Safari / Firefox / in-app / other), rendered as a share breakdown plus a *"Top browser"* metric on the Visitor Monitor.\n\n## Lint cleanup\n\nThe React Compiler-readiness lint rules in `eslint-plugin-react-hooks` v7 flagged ~40 warnings, almost all inside the react-three-fiber scene modules — mutating the three.js scene graph and refs inside `useFrame`, reading refs during render to mount pooled meshes, seeding geometry with `Math.random`. Those are **correct by design** for r3f, so the four compiler rules are scoped off for `src/components/effects/**`; the genuine warnings elsewhere (unused vars, stale disable directives, `exhaustive-deps`, `setState`-in-effect) were fixed properly. Result: **0 lint warnings**.\n'},{slug:"visitor-geo-inference-and-multi-provider-lookup",title:"Fixing unknown visitor countries: multi-provider geo and sibling inference",excerpt:"When ipwho.is fails, every visit becomes countryCode XX. Here is the fallback chain, iOS UA parsing fix, and how unresolved rows get backfilled from sibling visits.",date:"2026-07-08",tags:["Analytics","Supabase","Debugging"],ogImage:"/og/blog-visitor-geo.svg",content:`
The **/status** dashboard showed \`Unknown\` / \`XX\` for real visitors — especially iPhone Safari sessions. Two separate bugs stacked.

## Single provider fragility

Only **ipwho.is** was queried. Ad blockers, rate limits, and CI headless runs all returned failures → \`countryCode: "XX"\`.

**Fix:** sequential fallback across ipwho.is, ipapi.co, and geojs.io with a short retry pause.

## iOS mislabeled as macOS

iPhone Safari UAs contain \`like Mac OS X\`, so \`parseDevice\` reported \`Mobile \xb7 macOS\` instead of iOS. iPadOS desktop-mode UAs needed \`navigator.maxTouchPoints\` to distinguish from real Macs.

## Inference for old rows

Rows already stored as \`XX\` cannot be re-fetched by IP retroactively. Two heuristics help:

1. **Sibling inference** — if the same browser/OS/device type has a resolved visit within a time window, copy that geo.
2. **Current session** — if this browser now resolves geo, patch older unresolved rows from the same fingerprint.

LocalStorage backfill runs once per session. Supabase rows get the same patch when \`allow-geo-backfill-update.sql\` is applied.

## Display honesty

Unresolved visits show **"Location unavailable"**, are excluded from country share bars, and do not plot at \`0\xb0, 0\xb0\` on the map.
`},{slug:"resume-generation-with-playwright",title:"One HTML source, three exports: resume PDF and Word with Playwright",excerpt:"How resume.html becomes pixel-matched PDF and DOCX exports, syncs to public/ for Next.js, and auto-bumps RESUME_VERSION from git.",date:"2026-07-08",tags:["Python","Playwright","Resume","Tooling"],ogImage:"/og/blog-resume-playwright.svg",content:`
My resume lives as **one HTML file** (\`resume/resume.html\`). Everything else is generated.

## Pipeline

\`python resume/generate_resume.py\`:

1. Sync HTML to \`docs/\` and \`public/\`
2. Render PDF via Playwright + Chromium (A4, print CSS)
3. Rasterize PDF page to PNG at 220 DPI
4. Embed PNG in DOCX so Word matches PDF visually
5. Patch \`src/lib/resume.ts\` \`RESUME_VERSION\` from \`git log\` date of the HTML file

CI and deploy run the same script so live \`/resume.pdf\` never 404s.

## Why Playwright instead of wkhtmltopdf?

The resume uses modern CSS — flexbox sidebar, stroke icons, print media queries. Headless Chromium respects the same layout engine as Chrome print preview.

## Cache busting

Download links append \`?v=YYYYMMDD\` from \`RESUME_VERSION\`. Auto-deriving from git removes the manual bump step that was always forgotten after icon or address edits.

## Contact icon alignment

Lucide-style stroke SVGs at a fixed 12px column keep email, phone, LinkedIn, and GitHub labels aligned in HTML, PDF, and DOCX — verified with a small HTML regression test in CI.
`},{slug:"portfolio-v2-hardening-spa-navigation",title:"Portfolio v2 hardening: CI gates, bundle budgets, and a SPA navigation bug",excerpt:"A three-phase pass on reliability and performance — deploy gated on CI, server-component sections, Playwright smoke tests — and the subtle opacity bugs that broke the homepage on client-side navigation back from other routes.",date:"2026-07-08",tags:["Next.js","Performance","CI/CD","Debugging"],content:`
This site shipped a **v2.0 hardening pass** across deploy reliability, homepage performance, analytics honesty, and test coverage. Most of it is invisible when things work — which is the point — but one bug only showed up during real navigation: **Home → Work → Home** changed the URL correctly while parts of the homepage stayed invisible.

## Phase 0 — stop shipping broken deploys

Three production footguns were fixed first:

- **Deploy waits for CI** — the \`gh-pages\` workflow now runs only after the CI workflow succeeds on \`main\`, instead of racing it in parallel.
- **Resume binaries in the pipeline** — \`generate:resume\` (Playwright + Python) runs in CI and deploy so PDF/DOCX links don't 404 on the live site.
- **Docs and dead code** — README drift (Node 26, blog route, footer reality) was synced; the pre-Next.js \`docs-legacy/\` tree and unused Supabase server stubs were removed.

\`predev\` now runs \`generate:brand\` so local dev doesn't serve broken manifest/OG icon paths on a fresh clone.

## Phase 1 — homepage bundle diet (without breaking UX)

Four homepage sections — **About, Skills, Experience, Testimonials** — moved from client components to **server components**. Animation wrappers (\`TiltCard\`) stay client-only where interactivity is needed; the text and structure render as static HTML at build time.

A bundle gate tightened from **400 KB → 340 KB gzip** (measured baseline ~330 KB). Lighthouse performance is a **0.7 warn** on the homepage (LHCI desktop scores ~0.69–0.71 with run-to-run variance); the **bundle-size script** is the hard regression gate.

## Phase 2 — honest analytics and smoke tests

Analytics was consolidated around clearer tiers:

- **Plausible** — primary privacy-friendly page analytics (when configured).
- **Supabase** — optional cross-device visitor sync for the status dashboard demo.
- **CountAPI** — now opt-out via \`NEXT_PUBLIC_COUNTAPI_ENABLED=false\`; the UI shows "unavailable" instead of silently displaying zero.

**Playwright** smoke tests were added to CI (home, work, status, blog, skip link, and a round-trip navigation check). The status dashboard now labels probe history as **this browser only** — not a global SLA.

## The bug: some sections visible, some not

The worst issue appeared only on **client-side navigation back to /**\`. First load looked fine. Leaving and returning left a patchwork — Hero and About might show, Projects and Contact invisible until you scrolled (or forever, depending on the browser).

Three separate mechanisms stacked \`opacity: 0\`:

### 1. CSS \`animation-timeline: view()\`

Scroll-driven reveal CSS sets \`opacity: 0\` before the animation runs. On a full page load the timeline advances as you scroll. On SPA remount the timeline **does not reliably restart**, so sections can remain at opacity zero even though they're in the DOM.

**Fix:** remove scroll-driven opacity reveals from the critical path. \`Reveal\` is now a plain wrapper.

### 2. Framer \`whileInView\` with \`once: true\`

\`FadeIn\` used \`whileInView={{ opacity: 1 }}\` with \`viewport={{ once: true }}\`. When a section remounts **already in the viewport**, Framer may never re-fire the in-view trigger, leaving \`initial={{ opacity: 0 }}\` stuck.

**Fix:** drop opacity-based scroll fades entirely on homepage sections. Content is always visible; motion is limited to safe transforms (e.g. Hero title word slide) or removed where it conflicted with SPA navigation.

### 3. Route enter/exit opacity on \`AppShell\`

\`AnimatePresence\` wrapped every page in an opacity fade. Combined with the section-level bugs above, the whole main column could appear blank on return.

**Fix:** remove route enter opacity; keep a simple \`key={pathname}\` wrapper without fading the entire page in from zero.

## What we kept

- Server-component sections for static content (smaller JS, faster first paint).
- Bundle and Lighthouse CI gates.
- Playwright round-trip test asserting **all seven homepage sections** stay at \`opacity: 1\` after navigation.
- Deploy gated on green CI.

## Lesson

On a **static export + client navigation** site, any pattern that hides content at \`opacity: 0\` and waits for scroll or mount-time animation is a latent SPA bug. Progressive enhancement should mean "extra motion when it works," not "invisible until JavaScript animation fires."

For a portfolio, **reliability beats scroll theatrics**. The animations can come back later — behind a client-only Intersection Observer that resets on route change, or as transform-only effects that never hide content.
`},{slug:"static-portfolio-with-client-only-analytics",title:"Building a fully static portfolio with client-only visitor analytics",excerpt:"How this site runs entirely as a Next.js static export on GitHub Pages, yet still ships a live visitor map, uptime dashboard, and system telemetry — with no server at all.",date:"2026-03-14",tags:["Next.js","Static Export","Supabase","Architecture"],content:`
This site (im-rihan.github.io) is a **Next.js 16 static export** hosted on GitHub Pages — there is no server, no API routes, and no middleware in production. Every "backend" feature you see on the **/status** page — the visitor world map, uptime history, link health checks, and system telemetry — runs entirely in the browser.

## Why static?

GitHub Pages is free, fast via its CDN, and has zero maintenance burden. The trade-off is that anything dynamic has to be pushed to the client or to a third-party service that accepts requests directly from the browser.

## The analytics stack

Visitor analytics uses a layered fallback approach so the feature degrades gracefully:

- **Geo lookup** — [ipwho.is](https://ipwho.is) resolves an approximate country/city client-side, no API key needed.
- **Local persistence** — every visit is written to \`localStorage\` immediately, so the dashboard always has *something* to show, even offline.
- **Cross-device sync (optional)** — if Supabase env vars are configured at build time, visits are also inserted into a Postgres table via the anon/publishable key, and read back for a global view across devices.
- **Global counters** — a public CountAPI counter tracks total visits without needing any backend at all.

\`\`\`ts
async function trackVisit() {
  const geo = await lookupGeo();
  const visit = buildVisitRecord(geo);
  persistLocally(visit);
  await pushSupabaseVisit(visit); // no-op if not configured
  await incrementGlobalCounter();
}
\`\`\`

## Status page without a server

The **/status** dashboard runs client-side link probes against every route and external asset on an interval, using \`fetch\` with a timeout and classifying results into \`online\`, \`slow\`, \`offline\`, or \`unknown\`. Results are aggregated into an overall health banner and a rolling uptime history stored in \`localStorage\` — a lightweight status page that costs nothing to run and needs no monitoring service.

## Trade-offs

Nothing here is free of downsides:

- Anonymous Supabase reads mean the publishable key is visible in the client bundle — RLS policies have to assume any anonymous caller can send arbitrary requests, so writes must be validated with \`check\` constraints at the database level, not just in application code.
- Every environment variable is baked in at **build time**. Rotating a key means rebuilding and redeploying, not just changing a runtime secret.
- Third-party services (\`ipwho.is\`, CountAPI) have no SLA, so every call is wrapped in a try/catch that fails silently rather than breaking the page.

For a personal portfolio, these trade-offs are the right call — the whole point is near-zero operational cost while still demonstrating real production patterns.
`},{slug:"debugging-backdrop-filter-android-tablets",title:"Debugging a GPU compositing bug: blank glass cards on Android tablets",excerpt:"A Redmi Pad Pro user reported 'skeleton-like' pages and misplaced shadows while scrolling. The root cause: backdrop-filter and 3D transforms don't composite reliably together on some Android GPUs.",date:"2026-06-02",tags:["CSS","Performance","Mobile","Debugging"],content:`
A user on a **Redmi Pad Pro** reported that while scrolling this site, glass cards would render as blank "skeletons" with shadows detached from their boxes — a visual bug that never showed up on desktop or on my own test devices.

## Narrowing it down

The common thread across the affected cards (\`.glass-card\`, the navbar, tilt-effect project cards) was two CSS features stacked together:

\`\`\`css
.glass-card {
  backdrop-filter: blur(20px);
  transform-style: preserve-3d; /* from a parent tilt wrapper */
}
\`\`\`

Individually, both are well supported. Combined — on certain Android GPU/driver combinations — the compositor can fail to recompute the blurred backdrop layer correctly during scroll, leaving a stale or blank frame with its box-shadow rendered at the wrong offset. This is a known class of bug on mobile Chromium/WebView compositors, not something unique to this codebase.

## Why width-based breakpoints didn't help

My first instinct was "just disable effects below \`768px\`." That's wrong for this bug: a Redmi Pad Pro in landscape is **wider than most desktop breakpoints**, so width-based media queries never catch it — the tablet kept receiving full desktop styling, including mouse-oriented 3D tilt effects it can't hover to trigger anyway.

The right signal isn't screen size, it's **input capability**:

\`\`\`css
@media (hover: none), (pointer: coarse) {
  .glass-card {
    backdrop-filter: none;
    transform-style: flat;
    background: var(--bg-card-solid);
  }
}
\`\`\`

\`(hover: none)\` and \`(pointer: coarse)\` both describe touch-first input, regardless of viewport width — a large tablet in landscape still matches, while a mouse-driven ultrawide monitor doesn't.

## The full fix

Three changes, applied consistently:

1. A small \`prefersReducedEffects()\` utility combining \`(prefers-reduced-motion: reduce)\`, \`(hover: none)\`, and \`(pointer: coarse)\` into one check.
2. Framer Motion wrappers (\`FadeIn\`, \`TiltCard\`) read that utility on mount and render a plain, static element instead of the animated one on touch-first devices.
3. CSS media queries mirror the same logic to drop \`backdrop-filter\`/\`preserve-3d\` and fall back to solid backgrounds wherever glassmorphism is used — navbar, dropdown, cards.

The result: touch-first devices get flat, fast, correctly-composited UI, and desktop/mouse users keep the full glass + tilt experience. No visual regression, no more skeleton cards.
`},{slug:"hub-and-spoke-visitor-world-map",title:"From tangled lines to a hub-and-spoke visitor map",excerpt:"The status page's world map connected visitor countries sequentially, producing a tangled zig-zag instead of readable arcs. Here's how a hub-and-spoke projection fixed it.",date:"2026-05-18",tags:["Data Viz","SVG","UX"],content:`
The **/status** page includes a small world map showing which countries recent visitors came from, connected by animated arcs. The original implementation connected countries **sequentially** — country 1 to country 2, country 2 to country 3, and so on — which produced a tangled zig-zag with no clear meaning once more than three or four countries were present.

## The fix: hub-and-spoke

Instead of chaining points together, arcs now radiate from a single **hub** — the visitor's home country if present in the data, otherwise whichever country has the most visits — out to up to six other countries, capped to keep the map legible:

\`\`\`ts
const HOME_HUB_CODE = "IN";
const MAX_SPOKES = 6;

const hub = countries.find((c) => c.code === HOME_HUB_CODE) ?? countries[0];
const spokes = countries.filter((c) => c.code !== hub.code).slice(0, MAX_SPOKES);
\`\`\`

This reads immediately as "traffic radiating from home base" rather than an arbitrary path through the data.

## Unifying pin and arc projection

A second, subtler bug: pins and arc endpoints used **different math** to convert a country's \`[lon, lat]\` into pixel coordinates, so a pin and the arc that was supposed to terminate at it didn't actually line up. The fix was a single \`projectMapPoint()\` helper used everywhere a coordinate needs to become an \`{ xPct, yPct }\` position, so pins and arcs always agree.

## Filtering unknown countries

The geo lookup service occasionally returns an \`"XX"\` unknown-country sentinel (VPNs, some mobile carriers, or lookup failures). Before the fix, \`"XX"\` was silently plotted at \`[0, 0]\` — off the coast of West Africa — which showed up as a confusing phantom visitor. Now, a small \`hasCountryCoords()\` guard filters out any country without real coordinates before it ever reaches the map or the arc generator.

Small, unglamorous bugs like these — sequential vs. hub-and-spoke, mismatched projection math, a magic sentinel value — are usually more impactful to fix than they are interesting to write about, but they're exactly the kind of thing that separates a demo from something that actually reads correctly with real, messy production data.
`}];var c=e.i(53737);e.s(["BlogCardList",0,function({posts:e}){let d=(0,r.useMemo)(()=>(function(){let e=new Map;for(let t of l)for(let r of t.tags)e.set(r,(e.get(r)??0)+1);return[...e.entries()].sort((e,t)=>t[1]-e[1]||e[0].localeCompare(t[0])).map(([e])=>e)})(),[]),[u,h]=(0,r.useState)("all"),p=(0,r.useMemo)(()=>"all"===u?e:e.filter(e=>e.tags.includes(u)),[u,e]);return(0,t.jsxs)("div",{className:c.default.listWrap,children:[(0,t.jsxs)("div",{className:c.default.filters,role:"tablist","aria-label":"Filter posts by tag",children:[(0,t.jsx)("button",{type:"button",role:"tab","aria-selected":"all"===u,className:`${c.default.filterChip} ${"all"===u?c.default.filterActive:""}`,onClick:()=>h("all"),children:"All"}),d.map(e=>(0,t.jsx)("button",{type:"button",role:"tab","aria-selected":u===e,className:`${c.default.filterChip} ${u===e?c.default.filterActive:""}`,onClick:()=>h(e),children:e},e))]}),0===p.length?(0,t.jsx)("p",{className:c.default.empty,children:"No posts match this tag yet."}):(0,t.jsx)("div",{className:c.default.grid,children:p.map((e,r)=>(0,t.jsx)(s.FadeIn,{delay:.06*r,children:(0,t.jsxs)(a.default,{href:`/blog/${e.slug}/`,prefetch:!1,className:`glass-card ${c.default.card}`,"data-cursor":"pointer",children:[(0,t.jsxs)("div",{className:c.default.cardHead,children:[(0,t.jsx)(o.FileText,{size:18,className:c.default.icon,"aria-hidden":!0}),(0,t.jsxs)("span",{className:c.default.meta,children:[(0,t.jsx)(i.Calendar,{size:12,style:{verticalAlign:-2,marginRight:4},"aria-hidden":!0}),new Date(e.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})," · ",Math.max(1,Math.round(e.content.trim().split(/\s+/).length/220))," min read"]})]}),(0,t.jsx)("h2",{children:e.title}),(0,t.jsx)("p",{className:c.default.excerpt,children:e.excerpt}),(0,t.jsx)("div",{className:c.default.tags,children:e.tags.map(e=>(0,t.jsx)("span",{className:c.default.tag,children:e},e))}),(0,t.jsxs)("span",{className:c.default.cta,children:["Read post",(0,t.jsx)(n.ArrowRight,{size:16,"aria-hidden":!0})]})]})},e.slug))},u)]})}],46583)}]);