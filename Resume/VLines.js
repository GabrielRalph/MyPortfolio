import {SvgPlus, Vector, SvgPath} from "../4.js"

function screenToSvg(sp, svg){
  let br = svg.getBoundingClientRect();
  let bro = new Vector(br);
  let brsize = new Vector(br.width, br.height);
  let vb = svg.getAttribute("viewBox").split(" ");
  let vbo = new Vector(vb);
  let vbsize = new Vector(vb, 2);
  let sp_r_br = sp.sub(bro).div(brsize);
  let sp_r_vb = sp_r_br.mul(vbsize).add(vbo);
  return sp_r_vb;
}


function getMin(array, func) {
  let min = null;
  let minv = null;
  for (let value of array) {
    let dv = value;
    if (func instanceof Function) dv = func(value);
    if (dv < min || min == null) {
      min = dv;
      minv = value;
    }
  }
  return minv;
}

class VPath extends SvgPath{
  constructor(x, y, length) {
    super("path");
    this.M(new Vector(x, y));
    this.l(new Vector);
    this.length = length;
  }
  set center(value) {
    this.d.start.p = value;
    this.d.update();
  }
  get center(){
    return this.d.start.p.clone();
  }

  set direction(value){
    if (value instanceof Vector) {
      this.d.end.p = value.dir().mul(this.length);
      this.d.update();
    }
  }

  set cOp(value){
    this.styles = {stroke: `rgba(255,255,255, ${value/100})`}
  }
}

class VBall extends SvgPlus {
  #pos = null;
  constructor(rad = 0, pad = 10) {
    super("ellipse");
    this.props = {
      rx: rad,
      ry: rad
    }
    this.rad = rad;
    this.pad = new Vector(pad, pad);
    this.vel = new Vector(1, -2);
    this.a = new Vector(0.0, 0.01);
    this.decay = 0.9;
    window.onwheel = (e) => {
      console.log(e);
      this.vel.y  = e.deltaY*2;
    }
  }

  get svg(){
    return this.ownerSVGElement;
  }

  get min(){
    let vb = this.svg.getAttribute("viewBox").split(" ");
    return this.pad.add(new Vector(vb));
  }
  get max() {
    let vb = this.svg.getAttribute("viewBox").split(" ");
    return new Vector(vb).add(new Vector(vb, 2)).sub(this.pad);
  }



  onmousemove(e){
    if (e.buttons) {
      let max = this.max.add(this.pad);
      let size = this.svg.getBoundingClientRect();
      size = new Vector(size.width, size.height);
      let mov = new Vector(e.movementX, e.movementY);
      this.vel = mov.div(size).mul(max);
    }
  }

  set pos(v){
    this.props = {
      cx: v.x,
      cy: v.y,
    }
    this.#pos = v;
  }
  get pos(){
    return this.#pos;
  }

  update() {
    let min = this.min;
    let max = this.max;
    let pos = this.pos;
    let rad = this.rad;
    if (!pos) pos = this.min.add(this.max).div(2);
    this.vel = this.vel.add(this.a);
    pos = pos.add(this.vel);
    if (pos.x + rad > max.x) {
      this.vel.x *= -this.decay;
      pos.x = max.x - rad;
    } else if (pos.x - rad < min.x) {
      this.vel.x *= -this.decay;
      pos.x = min.x + rad;
    } else if (pos.y + rad > max.y) {
      this.vel.y *= -this.decay;
      pos.y = max.y - rad;
    } else if (pos.y - rad < min.y) {
      this.vel.y *= -this.decay;
      pos.y = min.y + rad;
    }
    this.pos = pos;
  }
}


class VLines extends SvgPlus{
  points = []
  constructor(el = "div"){
    super(el);
    this.width = 150;
    this.height = 150;
    this.svg = this.createChild("svg", {viewBox: `0 0 ${this.width} ${this.height}`});
    this.makePaths();
    this.animate();
  }

  screenToSvg(sp){
    return screenToSvg(sp, this.svg);
  }

  // onmousemove(e){
  //   let sp = this.screenToSvg(new Vector(e));
  //
  //   this.points = [sp];
  //   // this.paths[0].center = sp;
  //   // this.render();
  // }

  makePaths(length = 10){
    this.svg.innerHTML = "";
    let gp = this.svg.createChild("g", {class: "paths"})
    let paths = [];
    let pad = 10;
    let inc = 5;
    let lastPath = null;
    for (let x = pad; x <= this.width - pad; x += inc) {
      let row = [];
      for (let y = pad; y <= this.height - pad; y += inc) {
        let path = new VPath(x, y, length);
        if (lastPath != null) {
          lastPath.next = path;
        }
        lastPath = path;
        gp.appendChild(path);
        paths.push(path);

      }
    }
    this.paths = paths;
    this.balls = [];
    for (let x = pad*2; x < this.width - 2*pad; x+= 50) {
      for (let y = pad*2; y < this.width - 2*pad; y+= 50) {
        let ball = this.svg.createChild(VBall);
        ball.pos = new Vector(x, y);
        ball.vel = new Vector((Math.random()*10-5, Math.random()*10-5))
        this.balls.push(ball);
      }
    }
    // this.ball2 = this.svg.createChild(VBall);
    // this.ball3 = this.svg.createChild(VBall);
    // this.ball2.pos = new Vector(200, 200);
    // this.ball2.vel = new Vector(4, 5)
    // this.ball3.pos = new Vector(800, 500)
  }

  animate(){
    let path = null;
    let next = () => {
      this.render();
      window.requestAnimationFrame(next);
    }
    window.requestAnimationFrame(next);
  }

  render(){
    let points = [];
    for (let ball of this.balls) {
      ball.update();
      points.push(ball.pos);
    }
    for (let path of this.paths) {
      let sum = new Vector;
      for (let p of points) {
        sum = sum.add(path.center.sub(p)).mul(1 - (p.dist(path.center))/150);
      }
      let min_point = getMin(points, (p) => {return path.center.dist(p)});
      sum = path.center.sub(min_point);
      path.direction = sum;
      path.cOp = min_point.dist(path.center);
    }

  }
}

SvgPlus.defineHTMLElement(VLines);
export {VLines}
