var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = "white";

canvas.width = 600;
canvas.height = 600;


var cancel = setInterval(incrementSeconds, 1000);

// console.log(Math.atan2(5, 0.0001))

const GEO_DX = canvas.width / 2;
var GEO_DY = canvas.height / 2;

var  GEO_D = 10;
var EN = 4;

var rozmPkt = 10;

function x2ekr(l) {
    return Math.round(l * GEO_D + GEO_DX)
}

function y2ekr(l) {
    return Math.round(l * GEO_D + GEO_DY)
}

class Vec {
    constructor() {
        this.x = 0
        this.y = 0
        this.val = 0
        this.arg = 0
    }

    static fromArgValue(arg, val) {
        var res = new Vec()
        res.arg = arg
        res.val = val
        res.x = res.val * Math.cos(arg)
        res.y = val * Math.sin(arg)
        return res;
    }

    add(other) {
        this.x += other.x
        this.y += other.y
        this.updateArgVal()
    }

    // dodaj pomnożony
    addmul(other, mul) {
        this.x += other.x * mul
        this.y += other.y * mul
        this.updateArgVal()
    }

    getValue() {
        return Math.sqrt(Math.max(0, this.x * this.x + this.y * this.y))
    }

    getArg() {

        return Math.atan2(this.y, this.x)
    }

    updateArgVal() {
        this.arg = this.getArg()
        this.val = this.getValue()
    }
}



class Form {

    constructor() {
        this.poz = new Vec()
        this.pr = new Vec()
        this.licznikDrogi = 0;
        this.przysp = new Vec()
        this.speedlimit = 70
        this.wartPrzys = 0.25
        this.kat = 0;

        this.bgimg = new Image();
        this.imgLoaded = false
        this.bgimg.src = "img/bg.png"
        this.bgimg.onload = () => this.imgLoaded = true
        this.time = 0
        this.f16 = new Image();
        this.f16.src = "img/f16a3.png"
        this.f16.onload = () =>this.imgLoaded = true
        this.f16flame = new Image();
        this.f16flame.src = "img/f16b2a.png"
        this.f16flame.onload = () =>this.imgLoaded = true

    }


    putTlo() {


        // ctx.fillStyle = "blue";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);


        // ctx.fillStyle = "white";

        let ax = x2ekr(this.poz.x);
        let ay = y2ekr(this.poz.y);

   
        let enx = Math.floor(canvas.width / this.bgimg.width) + 2
        let eny = Math.floor(canvas.height / this.bgimg.height) + 2

        let imw = (this.bgimg.width);
        let imh = (this.bgimg.height);

        ax = (ax % imw) - imw;
        ay = (ay % imh) - imh;

        // bgimg.onload = () => {
        for (let i = 0; i <= enx; i++) {
            let by = ay;
            for (let j = 0; j <= eny; j++) {
                //ctx.beginPath();
                // ctx.arc(ax, by, 5, 0, 2 * Math.PI);
                // ctx.fill();
                ctx.drawImage(this.bgimg, ax, by)

                by += imh;
            }
            ax = ax + imw;
            }
        // };

    }

    iter() {

        if (!this.imgLoaded)
            return;


        var now = Date.now()

        if (this.time == 0)
            this.time = now

        var delta = now - this.time;
        this.time = now 

        this.putTlo()
        this.poz.addmul(this.pr, delta / 1000.0)

        // if (delta > 20)
            // console.log(delta)

        this.licznikDrogi += this.pr.val * delta / 1000

        document.getElementById("droga").innerHTML = (this.licznikDrogi/1000).toFixed(2) + "km"
        
        this.pr.add(this.przysp)
        this.pr = Vec.fromArgValue(this.pr.arg, Math.min(this.speedlimit, this.pr.val))
        document.getElementById("v").innerHTML = (((this.pr.val * 1.9).toFixed(0)) + "kt (" + (parseFloat(this.pr.val * 1.9 * 1.8).toFixed(0)) + "km/h)");
        // console.log(this.pr.val)

        let x0 = x2ekr(0);
        let y0 = y2ekr(0);

        const r = 6;
        const argDt = Math.PI / 7;


        // let x1 = x2ekr(-Math.cos(this.przysp.arg - argDt) * r)
        // let y1 = y2ekr(-Math.sin(this.przysp.arg - argDt) * r)
        let x2 = x2ekr(0)
        let y2 = y2ekr(0)
        // let x3 = x2ekr(-Math.cos(this.przysp.arg + argDt) * r)
        // let y3 = y2ekr(-Math.sin(this.przysp.arg + argDt) * r)




        ctx.save()
        ctx.translate(x2, y2)
        ctx.rotate(this.przysp.arg)
        if(this.przysp.val == 0){
            ctx.drawImage(this.f16, -this.f16.width*0.75, -this.f16.height/2)    
        }else{
            ctx.drawImage(this.f16flame, -this.f16flame.width*0.75, -this.f16flame.height/2)
        }
        ctx.restore()

        // ctx.strokeStyle = "red";
        // ctx.lineWidth = 3
        // ctx.beginPath();
        // ctx.moveTo(x1, y1)
        // ctx.lineTo(x2, y2)
        // ctx.lineTo(x3, y3)
        // ctx.stroke();

        
        

        document.getElementById("x").innerHTML = ("( " + parseFloat(this.poz.x).toFixed(0) + "x, " + parseFloat(this.poz.y).toFixed(0) + "y)");
        document.getElementById("st").innerHTML = this.kat;
    }


}


let form = new Form()


window.onload = function () {
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    //setInterval(update, 10);
   window.requestAnimationFrame(update)
}

function keyDown(e) {
    if (e.code == "ArrowUp") {
        form.przysp = Vec.fromArgValue(form.przysp.arg, -form.wartPrzys)
    }
    if (e.code == "ArrowDown") {
        form.przysp = Vec.fromArgValue(form.przysp.arg, +form.wartPrzys)
    }
    if (e.code == "ArrowLeft") {
        form.przysp = Vec.fromArgValue(form.przysp.arg - Math.PI / 20, form.przysp.val)
    }
    if (e.code == "ArrowRight") {
        form.przysp = Vec.fromArgValue(form.przysp.arg + Math.PI / 20, form.przysp.val)
    }
    form.kat = form.przysp.arg * 180 / Math.PI
    form.kat = ((Math.round(form.kat + 90) % 360) + 360) % 360;


}

function keyUp(e) {
    if (e.code == "ArrowUp" || e.code == "ArrowDown") {
        form.przysp = Vec.fromArgValue(form.przysp.arg, 0.0)
    }

}

function update() {
    form.iter()
    window.requestAnimationFrame(update)
}

var seconds = 0;

function incrementSeconds() {
    seconds += 1;
}

