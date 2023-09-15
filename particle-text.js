let font = new FontFace("NovemberCondensed", "url(font/NovemberCondensedLCG-Heavy.woff2)", {
    style: "normal",
    weight: "900",
    display: "swap",
  });

// await font.load();
font.load().then(() => {
  var canvas = document.getElementById("particleCanvas");
var textCanvas = document.getElementById("textCanvas");
var ctx = canvas.getContext("2d");
var tctx = textCanvas.getContext("2d");

var cw = canvas.width = window.innerWidth;
var ch = canvas.height = window.innerHeight;
var tcw = textCanvas.width = cw;
var tch = textCanvas.height = ch;

var mouseX = 0, mouseY = 0;

var textStr = "ВИКА+ЛЁША";
var num = 1100;
var particles = [];

var toff = 0.0;

tctx.fillStyle = "rgba(255, 255, 255, 1)";
// tctx.font = "14em Arial Black";
tctx.font = "150px NovemberCondensed";
tctx.textAlign = "right";
tctx.textBaseline = "middle";
// tctx.fillText(textStr, tcw-50, tch/2);
tctx.strokeText(textStr, tcw-50, tch/2);

var mt = tctx.measureText(textStr)

var tpixels = tctx.getImageData(0, 0, cw, ch).data;

var data32 = new Uint32Array(tpixels.buffer)
var position = [];
for (var i = 0; i < data32.length; i++) {
  if (data32[i] & 0xffff0000) { 
    position.push({
      x: (i % tcw),
      y: ((i / tcw)|0),
      a: tpixels[i*4 + 3] / 255
    });
  }
}

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.r = 3;
  this.theta = (Math.random() * 2 - 1)*0.02;
  this.thetab = 5;
  this.c = "rgba(250, 250, 255, 1.0)";
  this.lineLength = 200;
}

Particle.prototype.draw = function() {
  ctx.fillStyle = this.c;
  ctx.beginPath();
  ctx.arc(this.x + this.vx, this.y + this.vy, this.r, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.closePath();
};

Particle.prototype.move = function() {
  toff += 0.01;
  var movet = this.theta * toff;
  // console.log(movet);
  this.vx = Math.cos(movet)*this.thetab;
  this.vy = Math.sin(movet)*this.thetab;
}

Particle.prototype.drawLine = function() {
  for (var i = 0; i < particles.length; i++) {
    var op = particles[i];
    var dist = (this.x+this.vx-op.x-op.vx)**2 + (this.y+this.vy - op.y-op.vy)**2;
    if (dist < this.lineLength) {
      ctx.strokeStyle = this.c;
      ctx.beginPath();
      ctx.moveTo(this.x+this.vx, this.y+this.vy);
      ctx.lineTo(op.x+op.vx, op.y+op.vy);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

function init() {
  // num = position.length;  //test  
  for (var i = 0; i <  num; i++) {
    var pidx = Math.floor(Math.random() * position.length);
    particles[i] = new Particle(position[pidx].x, position[pidx].y);
    particles[i].draw();
  }
  
  animate();
}

function animate() {
  ctx.clearRect(0, 0, cw, ch);
  particles.forEach(function(p) {
    // console.log(p.vx, p.vy)
    p.move();
    p.draw()
    p.drawLine();
  });
  requestAnimationFrame(animate);
}

init();

});
