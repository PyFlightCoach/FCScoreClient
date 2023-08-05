
export class Point {
    x: number; y: number; z: number;
    constructor(x: number, y: number, z: number) {this.x = x; this.y = y; this.z = z;};

    static dot(a: Point, b: Point): number {return a.x * b.x + a.y * b.y + a.z * b.z;}

    static cross(a: Point, b: Point): Point {
        return new Point(
            a.y * b.z - a.z * b.y, 
            a.z * b.x - a.x * b.z, 
            a.x * b.y - a.y * b.x
        );
    }

    mul (val: number): Point {return new Point(val * this.x, val * this.y, val * this.z);}

    static add (a: Point, b: Point): Point {
        return new Point(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    offset(other: Point): Point {return Point.add(this, other);}

    static sum(ps: Point[]): Point {
        let op = new Point(0,0,0);
        ps.forEach((p) => {op=Point.add(op, p);});
        return op;
    }

}

export class Quaternion {
    w: number; x: number; y: number; z: number;
    constructor(w: number, x: number, y: number, z: number) {
        this.w = w; this.x = x; this.y = y; this.z = z;
    }

    axis(): Point {return new Point(this.x, this.y, this.z);}

    static mul(a: Quaternion, b: Quaternion): Quaternion {
        const w = a.w * b.w - Point.dot(a.axis(), b.axis());
        const xyz = Point.sum([
            b.axis().mul(a.w),
            a.axis().mul(b.w),
            Point.cross(a.axis(), b.axis())
        ]); 
        return new Quaternion(w, xyz.x, xyz.y, xyz.z)
    }

    norm(): Quaternion {
        const fac = 1 / Math.sqrt(this.w**2 + this.x**2 + this.y**2 + this.z**2)
        return new Quaternion(fac * this.w, fac * this.x, fac * this.y, fac * this.z);
    }
        
    conjugate(): Quaternion {return new Quaternion(this.w, -this.x, -this.y, -this.z);}
        
    inverse(): Quaternion {return this.conjugate().norm();}

    transform_point(p: Point): Point {
        //a, b = Base.length_check(self, point)
        return Quaternion.mul(
            Quaternion.mul(
                this, 
                new Quaternion(0, p.x, p.y, p.z)
            ), 
            this.inverse()
        ).axis();   
    }       
}


export class State {
    pos: Point; att: Quaternion;
    constructor(data: Record<string, any>) {
        this.pos = new Point(data.x, data.y, data.z);
        this.att = new Quaternion(data.rw, data.rx, data.ry, data.rx);
//        this.vel = new Point(data.u, data.v, data.w);
//        this.rvel = new Point(data.p, data.q, data.r);
    }

    body_to_world(p: Point): Point {return this.att.transform_point(p).offset(this.pos);}

}


export function zip(a: any[], b: any[]){
    let result: any[]=[];
    a.forEach(function(o,i){
        result.push(o);
       result.push(b[i]);
    });
    return result
}